import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';

dotenv.config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for migration");

    // 1. Fetch existing monolithic document
    const portfolioDoc = await Portfolio.findOne();
    
    if (!portfolioDoc) {
      console.log("No portfolio document found to migrate. Exiting.");
      process.exit(0);
    }

    console.log("Found portfolio document. Starting migration...");

    // 2. Migrate Projects
    if (portfolioDoc.projectPortfolio && Array.isArray(portfolioDoc.projectPortfolio.projects)) {
      console.log(`Migrating ${portfolioDoc.projectPortfolio.projects.length} projects...`);
      await Project.deleteMany({}); // Clear existing to prevent duplicates during testing
      await Project.insertMany(portfolioDoc.projectPortfolio.projects);
      console.log("Projects migrated successfully.");
    }

    // 3. Migrate Experiences
    if (portfolioDoc.workExperience && Array.isArray(portfolioDoc.workExperience.items)) {
      console.log(`Migrating ${portfolioDoc.workExperience.items.length} work experiences...`);
      await Experience.deleteMany({});
      await Experience.insertMany(portfolioDoc.workExperience.items);
      console.log("Work experiences migrated successfully.");
    }

    // 4. Migrate Education
    if (portfolioDoc.education && Array.isArray(portfolioDoc.education.items)) {
      console.log(`Migrating ${portfolioDoc.education.items.length} education entries...`);
      await Education.deleteMany({});
      await Education.insertMany(portfolioDoc.education.items);
      console.log("Education entries migrated successfully.");
    }

    console.log("Migration complete!");
    process.exit(0);

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrate();
