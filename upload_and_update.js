import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const images = {
    'welcome_1': 'welcome_1_1784234605245.png',
    'welcome_2': 'welcome_2_1784234625065.png',
    'intro_tall': 'intro_tall_1784234664999.png',
    'intro_short': 'intro_short_1784234685783.png',
    'about_me': 'about_me_1784234706635.png',
    'edu_banner': 'edu_banner_1784234736840.png',
    'work_1': 'work_1_1784234757078.png',
    'work_2': 'work_2_1784234778445.png',
    'gallery_1': 'gallery_1_1784234838549.png',
    'gallery_2': 'gallery_2_1784234862332.png',
    'gallery_3': 'gallery_3_1784234882940.png',
    'latest_main': 'latest_main_1784234978807.png',
    'latest_1': 'latest_1_1784235000399.png',
    'latest_2': 'latest_2_1784235023481.png',
    'contact': 'contact_1784235098810.png',
    'thank_you': 'thank_you_1784235123352.png'
};

const updateDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }));
        const data = await Portfolio.findOne();
        
        if(!data) { console.log('No data found'); process.exit(1); }

        console.log('Updating DB with local AI images...');
        
        const getUrl = (key) => `/ai-images/${images[key]}`;

        data.welcome.image1 = getUrl('welcome_1');
        data.welcome.image2 = getUrl('welcome_2');
        
        data.introduction.imageTall = getUrl('intro_tall');
        data.introduction.imageShort = getUrl('intro_short');
        
        data.aboutMe.image = getUrl('about_me');
        
        data.education.bannerImage = getUrl('edu_banner');
        
        data.workExperience.image1 = getUrl('work_1');
        data.workExperience.image2 = getUrl('work_2');
        
        data.projectPortfolio.images[0] = getUrl('gallery_1');
        data.projectPortfolio.images[1] = getUrl('gallery_2');
        data.projectPortfolio.images[2] = getUrl('gallery_3');
        
        data.latestProject.mainImage = getUrl('latest_main');
        data.latestProject.image1 = getUrl('latest_1');
        data.latestProject.image2 = getUrl('latest_2');
        
        data.contact.image = getUrl('contact');
        
        data.thankYou.image = getUrl('thank_you');

        ['welcome', 'introduction', 'aboutMe', 'education', 'workExperience', 'projectPortfolio', 'latestProject', 'contact', 'thankYou'].forEach(key => {
            data.markModified(key);
        });

        await data.save();
        console.log("Database successfully updated with AI images!");
        process.exit(0);

    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

updateDB();
