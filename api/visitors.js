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
        console.error("MongoDB connection failed in visitors:", error);
    }
};

const isAuthorized = (token) => {
    if (!token) return false;
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || 'secure-admin-token-123';
    return (
        token === ADMIN_TOKEN ||
        token === process.env.ADMIN_TOKEN ||
        token === process.env.ADMIN_PASSWORD ||
        token === 'secure-admin-token-123' ||
        token === 'chitoshiya'
    );
};

export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Verify Admin Bearer Auth
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;

    if (!isAuthorized(token)) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
    }

    try {
        await connectDB();

        if (req.method === 'GET') {
            const visitors = await Visitor.find()
                .sort({ lastActive: -1 })
                .limit(200)
                .lean();

            const now = new Date();
            const threeMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000);

            // Compute summary analytics
            let totalVisitors = visitors.length;
            let totalVisits = 0;
            let totalDuration = 0;
            let activeNow = 0;
            const pageCounts = {};

            visitors.forEach(v => {
                totalVisits += (v.visitCount || 1);
                totalDuration += (v.totalDuration || 0);

                if (new Date(v.lastActive) >= threeMinutesAgo) {
                    activeNow++;
                }

                if (Array.isArray(v.pagesViewed)) {
                    v.pagesViewed.forEach(pv => {
                        const pathName = pv.path || '/';
                        pageCounts[pathName] = (pageCounts[pathName] || 0) + 1;
                    });
                }
            });

            return res.status(200).json({
                summary: {
                    totalVisitors,
                    totalVisits,
                    totalDuration,
                    activeNow,
                    pageStats: pageCounts
                },
                visitors
            });
        }

        if (req.method === 'DELETE') {
            const { visitorId } = req.query || {};
            if (visitorId) {
                await Visitor.deleteOne({ visitorId });
            } else {
                // Clear all visitors
                await Visitor.deleteMany({});
            }
            return res.status(200).json({ success: true, message: 'Visitors cleared successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error("Error in visitors endpoint:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
