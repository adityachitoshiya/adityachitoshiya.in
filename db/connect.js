import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.log("No MONGODB_URI found, skipping database connection for local dev.");
            return;
        }
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.warn("MongoDB connection failed (Network/IP Whitelist issue):", error.message);
    }
};

export default connectDB;
