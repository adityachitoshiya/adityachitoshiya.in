import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }));
        const data = await Portfolio.findOne();
        fs.writeFileSync('current_data.json', JSON.stringify(data, null, 2));
        console.log("Data dumped to current_data.json");
        process.exit(0);
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

connectDB();
