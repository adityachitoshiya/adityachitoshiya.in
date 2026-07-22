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
import Project from './models/Project.js';
import Experience from './models/Experience.js';
import Education from './models/Education.js';

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
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'mp3', 'wav', 'mpeg', 'ogg'],
    resource_type: 'auto'
  },
});
const upload = multer({ storage: storage });

// GET all portfolio data
app.get('/api/portfolio', async (req, res) => {
    try {
        const data = await Portfolio.findOne();
        if (!data) return res.json({});
        
        // Convert mongoose document to plain JS object to modify it
        const responseData = data.toObject();

        // Fetch related collections
        const projects = await Project.find();
        const experiences = await Experience.find();
        const educations = await Education.find();

        // Merge back into the monolithic structure expected by the frontend
        if (!responseData.projectPortfolio) responseData.projectPortfolio = {};
        responseData.projectPortfolio.projects = projects;

        if (!responseData.workExperience) responseData.workExperience = {};
        responseData.workExperience.items = experiences;

        if (!responseData.education) responseData.education = {};
        responseData.education.items = educations;

        res.json(responseData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// POST to update entire portfolio data
app.post('/api/portfolio', async (req, res) => {
    try {
        const newData = req.body;
        
        // 1. Handle extracted collections
        if (newData.projectPortfolio && Array.isArray(newData.projectPortfolio.projects)) {
            await Project.deleteMany({});
            await Project.insertMany(newData.projectPortfolio.projects);
            // Remove from the monolith payload so we don't duplicate it
            delete newData.projectPortfolio.projects;
        }

        if (newData.workExperience && Array.isArray(newData.workExperience.items)) {
            await Experience.deleteMany({});
            await Experience.insertMany(newData.workExperience.items);
            delete newData.workExperience.items;
        }

        if (newData.education && Array.isArray(newData.education.items)) {
            await Education.deleteMany({});
            await Education.insertMany(newData.education.items);
            delete newData.education.items;
        }
        
        // 2. Handle monolithic data
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
        
        res.json({ success: true, message: 'Portfolio updated successfully across collections' });
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error',
        details: err 
    });
});

app.listen(PORT, () => {
    console.log(`Express Backend Server running on http://localhost:${PORT}`);
});
