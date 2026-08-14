import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../db/connect.js';
import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncData() {
  try {
    console.log("Connecting to MongoDB Atlas database...");
    await connectDB();

    const rawData = fs.readFileSync(path.join(__dirname, '../current_data.json'), 'utf-8');
    const newData = JSON.parse(rawData);

    console.log("1. Syncing Projects to MongoDB...");
    if (newData.projectPortfolio && Array.isArray(newData.projectPortfolio.projects)) {
      await Project.deleteMany({});
      await Project.insertMany(newData.projectPortfolio.projects);
      console.log(`   ✓ Synced ${newData.projectPortfolio.projects.length} projects.`);
    }

    console.log("2. Syncing Work Experiences to MongoDB...");
    if (newData.workExperience && Array.isArray(newData.workExperience.items)) {
      await Experience.deleteMany({});
      await Experience.insertMany(newData.workExperience.items);
      console.log(`   ✓ Synced ${newData.workExperience.items.length} work experience items.`);
    }

    console.log("3. Syncing Education to MongoDB...");
    if (newData.education && Array.isArray(newData.education.items)) {
      await Education.deleteMany({});
      await Education.insertMany(newData.education.items);
      console.log(`   ✓ Synced ${newData.education.items.length} education items.`);
    }

    console.log("4. Syncing Main Portfolio Document to MongoDB (preserving embedded items)...");
    let data = await Portfolio.findOne();
    if (!data) {
      data = new Portfolio(newData);
    } else {
      Object.assign(data, newData);
    }

    ['global', 'hero', 'welcome', 'introduction', 'aboutMe', 'education', 'workExperience', 'projectPortfolio', 'latestProject', 'contact', 'thankYou'].forEach(key => {
      data.markModified(key);
    });

    await data.save();
    console.log("\n✅ SUCCESS: All data from current_data.json (including Work Experience and Education items) synced to MongoDB Atlas!");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR syncing to MongoDB:", error);
    process.exit(1);
  }
}

syncData();
