import { NextResponse } from 'next/server';
import { uploadFileToGoogleDrive, getFolderIdForDomain } from '../../../lib/googleDriveService';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const uploadedUrls = [];
    const uploadResults = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const domain = formData.get('domain') || formData.get('wingId') || 'general-church';
      const targetFolderId = formData.get('folderId') || getFolderIdForDomain(domain);
      const files = formData.getAll('images').concat(formData.getAll('files'));

      if (!files || files.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No image files provided in formData' },
          { status: 400 }
        );
      }

      if (files.length > 20) {
        return NextResponse.json(
          { success: false, error: 'Maximum limit of 20 images reached' },
          { status: 400 }
        );
      }

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
          uploadedUrls.push(result.url);
        }
      }
    }

    return NextResponse.json({
      success: true,
      count: uploadedUrls.length,
      urls: uploadedUrls,
      imageUrls: uploadedUrls,
      items: uploadResults,
      message: `Successfully uploaded ${uploadedUrls.length} image(s).`,
    });
  } catch (error) {
    console.error('[API upload-images POST] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload images' },
      { status: 500 }
    );
  }
}
