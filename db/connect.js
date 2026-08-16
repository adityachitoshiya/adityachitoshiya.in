import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.log("No MONGODB_URI found in environment.");
            return;
        }
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("MongoDB Connected Successfully to Database!");
    } catch (error) {
        console.warn("MongoDB connection failed:", error.message);
    }
};

export default connectDB;
