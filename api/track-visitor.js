import mongoose from 'mongoose';
import Visitor from '../models/Visitor.js';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
    } catch (error) {
        console.error("MongoDB connection failed in track-visitor:", error);
    }
};

const getClientIp = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        const ips = xForwardedFor.split(',');
        return ips[0].trim();
    }
    return req.headers['x-real-ip'] || req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
};

const detectDevice = (ua = '') => {
    const userAgent = ua.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)) {
        return /ipad|tablet/i.test(userAgent) ? 'Tablet' : 'Mobile';
    }
    return 'Desktop';
};

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await connectDB();

        let body = req.body || {};
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) {}
        } else if (Buffer.isBuffer(body)) {
            try { body = JSON.parse(body.toString('utf-8')); } catch (e) {}
        }

        const { visitorId = '', sessionId, currentPath = '/', pageTitle = 'Portfolio', durationIncrement = 0, isNewSession = false } = body || {};

        const ip = getClientIp(req);
        if (!ip || ip === 'Unknown') {
            return res.status(400).json({ error: 'Valid IP is required' });
        }

        const userAgent = req.headers['user-agent'] || '';
        const deviceType = detectDevice(userAgent);
        const durationSec = Math.max(0, parseInt(durationIncrement, 10) || 0);

        // Enforce STRICT 1 IP = 1 Database Entry by finding document by IP
        let visitor = await Visitor.findOne({ ip });

        if (!visitor) {
            visitor = new Visitor({
                ip,
                visitorId: visitorId || ip,
                userAgent,
                deviceType,
                visitCount: 1,
                totalDuration: durationSec,
                lastActive: new Date(),
                firstVisit: new Date(),
                pagesViewed: [{
                    path: currentPath,
                    title: pageTitle,
                    timestamp: new Date(),
                    duration: durationSec
                }]
            });
        } else {
            // Update existing single entry for this IP
            visitor.visitorId = visitorId || visitor.visitorId || ip;
            visitor.userAgent = userAgent || visitor.userAgent;
            visitor.deviceType = deviceType || visitor.deviceType;
            visitor.lastActive = new Date();
            visitor.totalDuration += durationSec;

            if (isNewSession) {
                visitor.visitCount = (visitor.visitCount || 1) + 1;
            }

            // Check last page viewed
            const lastPage = visitor.pagesViewed && visitor.pagesViewed.length > 0
                ? visitor.pagesViewed[visitor.pagesViewed.length - 1]
                : null;

            if (lastPage && lastPage.path === currentPath) {
                lastPage.duration += durationSec;
                lastPage.timestamp = new Date();
            } else {
                if (visitor.pagesViewed.length >= 100) {
                    visitor.pagesViewed.shift();
                }
                visitor.pagesViewed.push({
                    path: currentPath,
                    title: pageTitle,
                    timestamp: new Date(),
                    duration: durationSec
                });
            }
        }

        await visitor.save();

        return res.status(200).json({ success: true, ip: visitor.ip });
    } catch (error) {
        console.error("Error tracking visitor:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
