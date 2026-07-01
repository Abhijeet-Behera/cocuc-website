import fs from 'fs';
import path from 'path';

// Copy user uploaded church images from cache to public assets
const srcLight = 'C:\\Users\\Susovon Patra\\.gemini\\antigravity-ide\\brain\\f2b19a24-df2e-4701-8ab5-90f79157baa4\\media__1782585980255.jpg';
const srcDark = 'C:\\Users\\Susovon Patra\\.gemini\\antigravity-ide\\brain\\f2b19a24-df2e-4701-8ab5-90f79157baa4\\media__1782585980229.png';
const destDir = './public';

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  if (fs.existsSync(srcLight)) {
    fs.copyFileSync(srcLight, path.join(destDir, 'church-light.jpg'));
    console.log('Successfully copied church-light.jpg');
  } else {
    console.warn('Source light image not found at:', srcLight);
  }

  if (fs.existsSync(srcDark)) {
    fs.copyFileSync(srcDark, path.join(destDir, 'church-dark.png'));
    console.log('Successfully copied church-dark.png');
  } else {
    console.warn('Source dark image not found at:', srcDark);
  }

  // Cleanup redundant folders
  const oldPage = './app/about/secretary-corner/page.js';
  if (fs.existsSync(oldPage)) {
    fs.unlinkSync(oldPage);
    console.log('Cleaned up redundant secretary-corner/page.js');
  }
  const oldDir = './app/about/secretary-corner';
  if (fs.existsSync(oldDir)) {
    fs.rmdirSync(oldDir);
    console.log('Cleaned up redundant secretary-corner folder');
  }
} catch (err) {
  console.error('Error during setup copies in next.config.mjs:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // Allow unoptimized images since next/image optimization requires a server
    unoptimized: true,
  },
};

export default nextConfig;

