import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const sourcePath = '/Users/adityachitoshiya/Documents/PORTFOLIO/Fevicon.png';
const publicDir = path.join(process.cwd(), 'public');

async function processFavicon() {
  console.log("1. Checking source file:", sourcePath);
  if (!fs.existsSync(sourcePath)) {
    console.error("Source file not found!");
    process.exit(1);
  }

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log("2. Generating local resized favicons for web...");
  const favicon32 = path.join(publicDir, 'favicon-32x32.png');
  const favicon180 = path.join(publicDir, 'apple-touch-icon.png');
  const faviconMain = path.join(publicDir, 'favicon.png');
  const faviconIco = path.join(publicDir, 'favicon.ico');

  execSync(`sips -z 32 32 "${sourcePath}" --out "${favicon32}"`);
  execSync(`sips -z 180 180 "${sourcePath}" --out "${favicon180}"`);
  execSync(`sips -z 64 64 "${sourcePath}" --out "${faviconMain}"`);
  execSync(`sips -z 32 32 "${sourcePath}" --out "${faviconIco}"`);

  console.log("Local resized favicons created successfully in /public");

  console.log("3. Uploading original high-res Favicon to Cloudinary...");
  const uploadResult = await cloudinary.uploader.upload(sourcePath, {
    folder: 'portfolio_uploads',
    public_id: 'site_favicon',
    overwrite: true,
    resource_type: 'image'
  });

  console.log("Cloudinary Upload Success!");
  console.log("Cloudinary URL:", uploadResult.secure_url);

  // Return Cloudinary URL
  return uploadResult.secure_url;
}

processFavicon().catch(err => {
  console.error("Favicon processing error:", err);
  process.exit(1);
});
