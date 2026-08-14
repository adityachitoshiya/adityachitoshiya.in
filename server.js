import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
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
import { get } from '@vercel/edge-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000', 
  'http://localhost:3001',
  'https://adityachitoshiya.in', 
  'https://www.adityachitoshiya.in'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', cors(), express.static(path.join(__dirname, 'public', 'uploads'))); // Serve uploads directly with CORS

connectDB();

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || 'secure-admin-token-123';

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized API Access' });
    }
};

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage config for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    return {
      folder: 'portfolio_uploads',
      resource_type: 'auto',
      ...(isImage && {
        format: 'webp',
        transformation: [{ quality: 'auto' }]
      })
    };
  },
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
});

// GET all portfolio data
// GET all portfolio data
app.get('/api/portfolio', async (req, res) => {
    try {
        if (process.env.USE_LOCAL_JSON === 'true' || mongoose.connection.readyState !== 1) {
            const rawData = fs.readFileSync(path.join(__dirname, 'current_data.json'), 'utf-8');
            return res.json(JSON.parse(rawData));
        }
        const data = await Portfolio.findOne();
        if (!data) {
            const rawData = fs.readFileSync(path.join(__dirname, 'current_data.json'), 'utf-8');
            return res.json(JSON.parse(rawData));
        }
        
        const responseData = data.toObject();
        const projects = await Project.find();
        const experiences = await Experience.find();
        const educations = await Education.find();

        if (!responseData.projectPortfolio) responseData.projectPortfolio = {};
        responseData.projectPortfolio.projects = projects;

        if (!responseData.workExperience) responseData.workExperience = {};
        responseData.workExperience.items = experiences;

        if (!responseData.education) responseData.education = {};
        responseData.education.items = educations;

        res.json(responseData);
    } catch (err) {
        console.warn("Falling back to local current_data.json:", err.message);
        try {
            const rawData = fs.readFileSync(path.join(__dirname, 'current_data.json'), 'utf-8');
            res.json(JSON.parse(rawData));
        } catch (fileErr) {
            console.error(fileErr);
            res.status(500).json({ error: "Server Error" });
        }
    }
});

// POST to update entire portfolio data
app.post('/api/portfolio', requireAuth, async (req, res) => {
    try {
        const newData = req.body;
        
        // Save to local JSON file
        fs.writeFileSync(path.join(__dirname, 'current_data.json'), JSON.stringify(newData, null, 2), 'utf-8');

        if (process.env.USE_LOCAL_JSON === 'true' || mongoose.connection.readyState !== 1) {
            return res.json({ success: true, message: 'Portfolio updated successfully in local current_data.json' });
        }

        // Handle MongoDB collections if connected
        if (newData.projectPortfolio && Array.isArray(newData.projectPortfolio.projects)) {
            await Project.deleteMany({});
            await Project.insertMany(newData.projectPortfolio.projects);
        }

        if (newData.workExperience && Array.isArray(newData.workExperience.items)) {
            await Experience.deleteMany({});
            await Experience.insertMany(newData.workExperience.items);
        }

        if (newData.education && Array.isArray(newData.education.items)) {
            await Education.deleteMany({});
            await Education.insertMany(newData.education.items);
        }
        
        let data = await Portfolio.findOne();
        if (!data) {
            data = new Portfolio(newData);
        } else {
            Object.assign(data, newData);
        }
        
        ['global', 'hero', 'welcome', 'introduction', 'aboutMe', 'education', 'workExperience', 'projectPortfolio', 'latestProject', 'contact', 'thankYou', 'gigs'].forEach(key => {
            data.markModified(key);
        });

        await data.save();
        
        res.json({ success: true, message: 'Portfolio updated successfully across collections and local JSON' });
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
        res.json({ success: true, token: ADMIN_TOKEN });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// GET signed parameters for direct browser-to-Cloudinary upload (bypasses Vercel 4.5MB limit)
app.get('/api/cloudinary-signature', requireAuth, (req, res) => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return res.status(400).json({ success: false, message: 'Cloudinary environment variables missing' });
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = 'portfolio_uploads';
        const eager = 'q_auto,f_auto,w_1280,vc_auto'; // Auto-compress video and image upon upload
        
        const paramsToSign = {
            timestamp: timestamp,
            folder: folder,
            eager: eager
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            success: true,
            signature,
            timestamp,
            folder,
            eager,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        });
    } catch (err) {
        console.error("Signature generation error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST for single file upload to Cloudinary (fallback)
app.post('/api/upload', requireAuth, upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // Cloudinary automatically adds 'path' (secure_url) to req.file
    const fileUrl = req.file.path;
    res.json({ success: true, url: fileUrl });
});

// Vercel Edge Config Welcome Route
app.get('/api/welcome', async (req, res) => {
    try {
        const greeting = await get('greeting');
        res.json({ greeting });
    } catch (error) {
        console.error("Edge config error:", error);
        res.status(500).json({ error: "Failed to fetch edge config" });
    }
});

// Visitor Analytics Routes for Express Local Server
import Visitor from './models/Visitor.js';

app.post('/api/track-visitor', async (req, res) => {
    try {
        const { visitorId, sessionId, currentPath = '/', pageTitle = 'Portfolio', durationIncrement = 0, isNewSession = false } = req.body || {};
        if (!visitorId) return res.status(400).json({ error: 'visitorId required' });

        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || '';
        const deviceType = /mobile|android|iphone/i.test(userAgent) ? 'Mobile' : 'Desktop';
        const durationSec = Math.max(0, parseInt(durationIncrement, 10) || 0);

        let visitor = await Visitor.findOne({ visitorId });
        if (!visitor) {
            visitor = new Visitor({
                visitorId, ip, userAgent, deviceType,
                visitCount: 1, totalDuration: durationSec,
                lastActive: new Date(), firstVisit: new Date(),
                pagesViewed: [{ path: currentPath, title: pageTitle, timestamp: new Date(), duration: durationSec }]
            });
        } else {
            visitor.ip = ip || visitor.ip;
            visitor.userAgent = userAgent || visitor.userAgent;
            visitor.deviceType = deviceType || visitor.deviceType;
            visitor.lastActive = new Date();
            visitor.totalDuration += durationSec;
            if (isNewSession) visitor.visitCount = (visitor.visitCount || 1) + 1;

            const lastPage = visitor.pagesViewed?.[visitor.pagesViewed.length - 1];
            if (lastPage && lastPage.path === currentPath) {
                lastPage.duration += durationSec;
                lastPage.timestamp = new Date();
            } else {
                if (visitor.pagesViewed.length >= 100) visitor.pagesViewed.shift();
                visitor.pagesViewed.push({ path: currentPath, title: pageTitle, timestamp: new Date(), duration: durationSec });
            }
        }
        await visitor.save();
        res.json({ success: true });
    } catch (err) {
        console.error("Track error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/visitors', requireAuth, async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ lastActive: -1 }).limit(200).lean();
        const now = new Date();
        const threeMinAgo = new Date(now.getTime() - 3 * 60 * 1000);

        let totalVisitors = visitors.length;
        let totalVisits = 0;
        let totalDuration = 0;
        let activeNow = 0;
        const pageCounts = {};

        visitors.forEach(v => {
            totalVisits += (v.visitCount || 1);
            totalDuration += (v.totalDuration || 0);
            if (new Date(v.lastActive) >= threeMinAgo) activeNow++;
            if (Array.isArray(v.pagesViewed)) {
                v.pagesViewed.forEach(pv => {
                    const pathName = pv.path || '/';
                    pageCounts[pathName] = (pageCounts[pathName] || 0) + 1;
                });
            }
        });

        res.json({
            summary: { totalVisitors, totalVisits, totalDuration, activeNow, pageStats: pageCounts },
            visitors
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/visitors', requireAuth, async (req, res) => {
    try {
        const { visitorId } = req.query;
        if (visitorId) await Visitor.deleteOne({ visitorId });
        else await Visitor.deleteMany({});
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
