import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Remove the base64 prefix
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // Path to save the image
    const filePath = path.join(process.cwd(), 'public', 'images', 'pastors-note', 'songram-keshari-singh.png');

    // Create a backup of the original if it doesn't exist yet
    const backupPath = path.join(process.cwd(), 'public', 'images', 'pastors-note', 'songram-keshari-singh-backup.png');
    if (!fs.existsSync(backupPath) && fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // Write the new image file
    fs.writeFileSync(filePath, base64Data, 'base64');

    return NextResponse.json({ success: true, message: 'Image saved successfully' });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
