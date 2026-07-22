import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  year: { type: String, required: true },
  institution: { type: String, required: true },
  description: { type: String }
});

export default mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
