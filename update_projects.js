import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const updateDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }));
        const data = await Portfolio.findOne();
        
        if(!data) { console.log('No data found'); process.exit(1); }

        console.log('Adding slugs and placeholder images to projects...');
        
        data.projectPortfolio.projects = data.projectPortfolio.projects.map(p => {
            return {
                ...p,
                slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                coverImage: p.coverImage || `https://placehold.co/800x1000/0a0a0a/f5a623?text=${encodeURIComponent(p.name)}+Cover`, // TODO: replace with real project photo
                gallery: p.gallery || [
                    `https://placehold.co/1200x800/0a0a0a/f5a623?text=${encodeURIComponent(p.name)}+1`, // TODO: replace with real project photo
                    `https://placehold.co/1200x800/0a0a0a/f5a623?text=${encodeURIComponent(p.name)}+2`, // TODO: replace with real project photo
                ],
                year: p.year || "2024",
                role: p.role || "Lead Designer"
            };
        });

        data.markModified('projectPortfolio');
        await data.save();
        console.log("Database successfully updated!");
        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

updateDB();
