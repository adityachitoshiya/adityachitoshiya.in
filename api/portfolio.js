import mongoose from 'mongoose';
import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
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

            const responseData = data.toObject();

            // Fetch separate collections if embedded items are missing or empty
            const [projects, experiences, educations] = await Promise.all([
                Project.find().lean().catch(() => []),
                Experience.find().lean().catch(() => []),
                Education.find().lean().catch(() => [])
            ]);

            if (!responseData.projectPortfolio) responseData.projectPortfolio = {};
            if (!Array.isArray(responseData.projectPortfolio.projects) || responseData.projectPortfolio.projects.length === 0) {
                if (projects && projects.length > 0) {
                    responseData.projectPortfolio.projects = projects;
                }
            }

            if (!responseData.workExperience) responseData.workExperience = {};
            if (!Array.isArray(responseData.workExperience.items) || responseData.workExperience.items.length === 0) {
                if (experiences && experiences.length > 0) {
                    responseData.workExperience.items = experiences;
                }
            }

            if (!responseData.education) responseData.education = {};
            if (!Array.isArray(responseData.education.items) || responseData.education.items.length === 0) {
                if (educations && educations.length > 0) {
                    responseData.education.items = educations;
                }
            }

            return res.status(200).json(responseData);
        } catch (err) {
            console.error("Error in GET /api/portfolio:", err);
            return res.status(500).json({ error: "Server Error", details: err.message });
        }
    } 
    else if (req.method === 'POST') {
        try {
            const newData = req.body;

            // Sync with separate collections if arrays exist
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
