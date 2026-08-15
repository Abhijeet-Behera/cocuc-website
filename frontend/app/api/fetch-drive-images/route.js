import { NextResponse } from 'next/server';
import { fetchGoogleDriveImages, extractFolderId } from '../../../lib/googleDrive';

export async function POST(request) {
  try {
    const body = await request.json();
    const { folderUrl, wingHint } = body;

    if (!folderUrl) {
      return NextResponse.json(
        { success: false, error: 'Google Drive Folder URL is required' },
        { status: 400 }
      );
    }

    const folderId = extractFolderId(folderUrl);
    if (!folderId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid Google Drive folder link. Please provide a link formatted like: https://drive.google.com/drive/folders/FOLDER_ID',
        },
        { status: 400 }
      );
    }

    const result = await fetchGoogleDriveImages(folderUrl, undefined, wingHint || 'default');
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API fetch-drive-images] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process Google Drive link' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderUrl = searchParams.get('folderUrl') || searchParams.get('url') || searchParams.get('folderId');
    const wingHint = searchParams.get('wingHint') || 'default';

    if (!folderUrl) {
      return NextResponse.json(
        { success: false, error: 'Query param folderUrl is required' },
        { status: 400 }
      );
    }

    const result = await fetchGoogleDriveImages(folderUrl, undefined, wingHint);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[API fetch-drive-images GET] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Drive images' },
      { status: 500 }
    );
  }
}
