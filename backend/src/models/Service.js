import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  subCategory: { type: String, default: '' },
  description: { type: String, default: '' },
  basePriceRange: {
    min: { type: Number, required: true, default: 299 },
    max: { type: Number, required: true, default: 999 }
  },
  estimatedDurationMinutes: { type: Number, default: 60 },
  isEmergencyEligible: { type: Boolean, default: false, index: true },
  icon: { type: String, default: 'tool' },
  includedTasks: [{ type: String }],
  excludedTasks: [{ type: String }]
}, {
  timestamps: true
});

serviceSchema.index({ name: 'text', category: 'text', description: 'text' });

export const Service = mongoose.model('Service', serviceSchema);
