import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'mp3', 'wav', 'mpeg', 'ogg'],
    resource_type: 'auto'
  },
});

const upload = multer({ storage: storage });

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    upload.single('media')(req, res, (err) => {
        if (err) {
            console.error("Multer Error:", err);
            return res.status(500).json({ success: false, message: 'Upload failed', details: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Cloudinary automatically adds 'path' (secure_url) to req.file
        const fileUrl = req.file.path;
        return res.status(200).json({ success: true, url: fileUrl });
    });
}
