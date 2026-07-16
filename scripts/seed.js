import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Portfolio from '../models/Portfolio.js';
import connectDB from '../db/connect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to project root
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
    await connectDB();
    
    const dataPath = path.join(__dirname, '../data/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const portfolioData = JSON.parse(rawData);

    // Clear existing
    await Portfolio.deleteMany({});
    
    // Insert
    await Portfolio.create(portfolioData);
    
    console.log("Data Seeded Successfully to MongoDB");
    process.exit(0);
};

seedData();
