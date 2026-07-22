import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // Optional for future expansion
  slug: { type: String }   // Optional for routing
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
