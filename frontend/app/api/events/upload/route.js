import { NextResponse } from 'next/server';
import { uploadFileToGoogleDrive, getFolderIdForDomain } from '../../../../lib/googleDriveService';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const domain = formData.get('domain') || formData.get('wingId') || 'general-church';
    const targetFolderId = formData.get('folderId') || getFolderIdForDomain(domain);

    const files = formData.getAll('images').concat(formData.getAll('files'));

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No image files provided for upload.' },
        { status: 400 }
      );
    }

    if (files.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Maximum limit of 20 images reached' },
        { status: 400 }
      );
    }

    const uploadResults = [];
    const imageUrls = [];
    const fileIds = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || typeof file === 'string') continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await uploadFileToGoogleDrive({
        buffer,
        fileName: file.name || `image_${i + 1}.jpg`,
        mimeType: file.type || 'image/jpeg',
        domainOrWingId: domain,
        targetFolderId,
      });

      if (result && result.success) {
        uploadResults.push(result);
        imageUrls.push(result.url);
        fileIds.push(result.fileId);
      }
    }

    return NextResponse.json({
      success: true,
      count: imageUrls.length,
      domain,
      folderId: targetFolderId,
      urls: imageUrls,
      imageUrls,
      fileIds,
      items: uploadResults,
      message: `Successfully uploaded ${imageUrls.length} image(s) to Google Drive.`,
    });
  } catch (error) {
    console.error('[API events/upload POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload images to Google Drive' },
      { status: 500 }
    );
  }
}
