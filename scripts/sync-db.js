import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function syncDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI is not defined in environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB...');

    const db = mongoose.connection.db;
    const portfolioCol = db.collection('portfolios');
    const portfolioData = await portfolioCol.findOne();

    if (portfolioData) {
      // Sync src/data.js
      const dataFilePath = path.resolve('src/data.js');
      const fileContent = `export const portfolioData = ${JSON.stringify(portfolioData, null, 2)};\n`;
      fs.writeFileSync(dataFilePath, fileContent, 'utf-8');

      // Sync current_data.json
      const currentDataPath = path.resolve('current_data.json');
      fs.writeFileSync(currentDataPath, JSON.stringify(portfolioData, null, 2), 'utf-8');

      console.log('Successfully auto-synced MongoDB latest data to src/data.js and current_data.json!');
    } else {
      console.warn('No portfolio document found in MongoDB.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error syncing DB:', error);
    process.exit(1);
  }
}

syncDB();
