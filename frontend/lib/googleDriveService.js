import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Domain / Wing to Environment Variable Mapping
export const DOMAIN_TO_ENV_KEY_MAP = {
  'general-church': 'DRIVE_FOLDER_GENERAL_CHURCH',
  'General Church': 'DRIVE_FOLDER_GENERAL_CHURCH',
  'ce-union': 'DRIVE_FOLDER_CE_UNION',
  'CE Union': 'DRIVE_FOLDER_CE_UNION',
  'mahila-samiti': 'DRIVE_FOLDER_MAHILA_SAMITI',
  'womens-fellowship': 'DRIVE_FOLDER_MAHILA_SAMITI',
  'Mahila Samiti': 'DRIVE_FOLDER_MAHILA_SAMITI',
  "Women's Fellowship (Mahila Samiti)": 'DRIVE_FOLDER_MAHILA_SAMITI',
  'sunday-school': 'DRIVE_FOLDER_SUNDAY_SCHOOL',
  'Sunday School': 'DRIVE_FOLDER_SUNDAY_SCHOOL',
  'youth-fellowship': 'DRIVE_FOLDER_YOUTH_FELLOWSHIP',
  'Youth Fellowship': 'DRIVE_FOLDER_YOUTH_FELLOWSHIP',
  'elders-fellowship': 'DRIVE_FOLDER_ELDERS_FELLOWSHIP',
  'Elders Fellowship': 'DRIVE_FOLDER_ELDERS_FELLOWSHIP',
  "Elder's Fellowship": 'DRIVE_FOLDER_ELDERS_FELLOWSHIP',
};

/**
 * Resolves the Google Drive Subfolder ID for a given domain/wing
 */
export function getFolderIdForDomain(domainOrWingId) {
  if (!domainOrWingId) {
    return process.env.DRIVE_MAIN_EVENTS_FOLDER_ID || '';
  }

  const envKey = DOMAIN_TO_ENV_KEY_MAP[domainOrWingId] || DOMAIN_TO_ENV_KEY_MAP[domainOrWingId.trim()];
  if (envKey && process.env[envKey] && !process.env[envKey].startsWith('your_')) {
    return process.env[envKey];
  }

  return process.env.DRIVE_MAIN_EVENTS_FOLDER_ID || '';
}

// In-memory token cache for service account JWT
let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Obtains a Google OAuth2 Access Token using Service Account Private Key & JWT
 */
async function getGoogleServiceAccountToken() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey || email.startsWith('your_') || privateKey.startsWith('your_')) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && tokenExpiresAt > now + 60) {
    return cachedAccessToken;
  }

  // Format private key (handle escaped newlines)
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  // JWT Header and Payload
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64UrlEncode = (obj) => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  signer.end();
  const signature = signer.sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwtToken = `${signatureInput}.${signature}`;

  // Exchange JWT for OAuth2 Access Token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken,
    }),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.access_token) {
    cachedAccessToken = tokenData.access_token;
    tokenExpiresAt = now + (tokenData.expires_in || 3600);
    return cachedAccessToken;
  }

  console.warn('[GoogleDriveService] Failed to obtain OAuth token from JWT:', tokenData);
  return null;
}

/**
 * Uploads a file buffer to Google Drive (with local storage fallback)
 */
export async function uploadFileToGoogleDrive({
  buffer,
  fileName,
  mimeType = 'image/jpeg',
  domainOrWingId,
  targetFolderId,
}) {
  const folderId = targetFolderId || getFolderIdForDomain(domainOrWingId);
  const accessToken = await getGoogleServiceAccountToken();

  if (accessToken && folderId && !folderId.startsWith('your_')) {
    try {
      // 1. Google Drive Multipart Upload (Metadata + Binary Body)
      const metadata = {
        name: fileName,
        mimeType: mimeType,
        parents: [folderId],
      };

      const boundary = `-------GoogleDriveBoundary${Date.now()}`;
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
      const mediaHeader = `${delimiter}Content-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n`;

      const multipartBody = Buffer.concat([
        Buffer.from(metadataPart, 'utf-8'),
        Buffer.from(mediaHeader, 'utf-8'),
        Buffer.from(buffer.toString('base64'), 'utf-8'),
        Buffer.from(closeDelimiter, 'utf-8'),
      ]);

      const uploadRes = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'Content-Length': String(multipartBody.length),
          },
          body: multipartBody,
        }
      );

      const fileData = await uploadRes.json();

      if (fileData.id) {
        // 2. Set Public Reader Permissions (Anyone with link can view)
        try {
          await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              role: 'reader',
              type: 'anyone',
            }),
          });
        } catch (permErr) {
          console.warn('[GoogleDriveService] Permission update warning:', permErr);
        }

        // Direct CDN link format for high performance and reliable thumbnail rendering
        const directUrl = `https://lh3.googleusercontent.com/d/${fileData.id}`;
        const thumbnail = `https://drive.google.com/thumbnail?id=${fileData.id}&sz=w1200`;

        return {
          success: true,
          storage: 'google_drive',
          fileId: fileData.id,
          name: fileData.name || fileName,
          url: directUrl,
          directUrl,
          thumbnailUrl: thumbnail,
          folderId,
        };
      }
    } catch (driveErr) {
      console.error('[GoogleDriveService] Drive API upload error, falling back to local:', driveErr);
    }
  }

  // Fallback: Store locally in domain-specific subfolder under /public/uploads/events/<domain>
  const cleanDomain = (domainOrWingId || 'general-church').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'events', cleanDomain);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(fileName) || '.jpg';
  const cleanBase = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeFilename = `drive_fallback_${Date.now()}_${cleanBase}${ext}`;
  const filePath = path.join(uploadsDir, safeFilename);

  await fs.promises.writeFile(filePath, buffer);
  const localUrl = `/uploads/events/${cleanDomain}/${safeFilename}`;

  return {
    success: true,
    storage: 'local_fallback',
    fileId: `local-${Date.now()}`,
    name: fileName,
    url: localUrl,
    directUrl: localUrl,
    thumbnailUrl: localUrl,
    folderId: folderId || `local_${cleanDomain}`,
    domain: cleanDomain,
  };
}
