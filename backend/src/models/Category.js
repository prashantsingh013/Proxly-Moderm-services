import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  icon: { type: String, default: 'wrench' },
  description: { type: String, default: '' },
  parentCategory: { type: String, default: null },
  aiKeywords: [{ type: String }],
  isPopular: { type: Boolean, default: false }
}, {
  timestamps: true
});

categorySchema.index({ name: 'text', description: 'text', aiKeywords: 'text' });

export const Category = mongoose.model('Category', categorySchema);
