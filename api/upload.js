import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
    api: {
        bodyParser: false, // Disables Vercel's default body parser so formidable can process the stream
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Formidable Error:", err);
            return res.status(500).json({ success: false, message: 'Upload parsing failed' });
        }

        const fileArray = Array.isArray(files.media) ? files.media : [files.media];
        const file = fileArray[0];

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        try {
            const result = await cloudinary.uploader.upload(file.filepath, {
                folder: 'portfolio_uploads'
            });
            res.status(200).json({ success: true, url: result.secure_url });
        } catch (uploadErr) {
            console.error("Cloudinary Upload Error:", uploadErr);
            res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
        }
    });
}
