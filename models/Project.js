import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String },
  name: { type: String, required: true },
  type: { type: String, required: true },
  year: { type: String },
  role: { type: String },
  description: { type: String },
  coverImage: { type: String },
  gallery: [{ type: String }],
  slug: { type: String }
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
