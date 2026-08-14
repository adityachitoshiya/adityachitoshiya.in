import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing on Vercel' 
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'portfolio_uploads';
    const eager = 'q_auto,f_auto,w_1280,vc_auto';

    const paramsToSign = {
      timestamp: timestamp,
      folder: folder,
      eager: eager
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret
    );

    return res.status(200).json({
      success: true,
      signature,
      timestamp,
      folder,
      eager,
      cloudName,
      apiKey
    });
  } catch (err) {
    console.error("Cloudinary signature error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
