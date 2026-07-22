import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  year: { type: String, required: true },
  institution: { type: String, required: true },
  description: { type: String }
});

export default mongoose.models.Education || mongoose.model('Education', educationSchema);
