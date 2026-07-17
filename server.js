import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import connectDB from './db/connect.js';
import Portfolio from './models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads'))); // Serve uploads directly

connectDB();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage config for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'mov'],
  },
});
const upload = multer({ storage: storage });

// GET all portfolio data
app.get('/api/portfolio', async (req, res) => {
    try {
        const data = await Portfolio.findOne();
        if (!data) return res.json({});
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// POST to update entire portfolio data
app.post('/api/portfolio', async (req, res) => {
    try {
        const newData = req.body;
        
        let data = await Portfolio.findOne();
        if (!data) {
            data = new Portfolio(newData);
        } else {
            Object.assign(data, newData);
        }
        
        // Force Mongoose to mark mixed/nested properties as modified
        ['global', 'hero', 'welcome', 'introduction', 'aboutMe', 'education', 'workExperience', 'projectPortfolio', 'latestProject', 'contact', 'thankYou'].forEach(key => {
            data.markModified(key);
        });

        await data.save();
        
        res.json({ success: true, message: 'Portfolio updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

// POST for login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // Check against environment variables
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'password';

    if (username === validUsername && password === validPassword) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// POST for single file upload to Cloudinary
app.post('/api/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Cloudinary automatically adds 'path' (secure_url) to req.file
    const fileUrl = req.file.path;
    res.json({ success: true, url: fileUrl });
});

app.listen(PORT, () => {
    console.log(`Express Backend Server running on http://localhost:${PORT}`);
});
