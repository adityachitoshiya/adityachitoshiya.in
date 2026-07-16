import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  global: { type: Object, default: {} },
  hero: { type: Object, default: {} },
  welcome: { type: Object, default: {} },
  introduction: { type: Object, default: {} },
  aboutMe: { type: Object, default: {} },
  education: { type: Object, default: {} },
  workExperience: { type: Object, default: {} },
  projectPortfolio: { type: Object, default: {} },
  latestProject: { type: Object, default: {} },
  contact: { type: Object, default: {} },
  thankYou: { type: Object, default: {} }
}, { strict: false });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
