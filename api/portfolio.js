import mongoose from 'mongoose';
import Portfolio from '../models/Portfolio.js';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB Connected (Serverless)");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
};

export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const data = await Portfolio.findOne();
            if (!data) return res.status(200).json({});
            return res.status(200).json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server Error" });
        }
    } 
    else if (req.method === 'POST') {
        try {
            const newData = req.body;
            let data = await Portfolio.findOne();
            if (!data) {
                data = new Portfolio(newData);
            } else {
                Object.assign(data, newData);
            }
            
            // Force Mongoose to mark properties as modified
            ['global', 'hero', 'welcome', 'introduction', 'aboutMe', 'education', 'workExperience', 'projectPortfolio', 'latestProject', 'contact', 'thankYou'].forEach(key => {
                data.markModified(key);
            });

            await data.save();
            return res.status(200).json({ success: true, message: 'Portfolio updated successfully' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server Error", details: err.message });
        }
    } 
    else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}
