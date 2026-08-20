import fs from 'fs';
import path from 'path';

try {
  const destDir = './public';
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
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
  console.error('Error during setup in next.config.mjs:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    // Allow unoptimized images since next/image optimization requires a server
    unoptimized: true,
  },
};

export default nextConfig;
