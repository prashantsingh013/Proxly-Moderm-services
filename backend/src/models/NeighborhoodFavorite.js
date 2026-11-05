import mongoose from 'mongoose';

const neighborhoodFavoriteSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  locality: { type: String, required: true },
  pincode: { type: String, default: '560038' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

neighborhoodFavoriteSchema.index({ customerId: 1, providerId: 1 }, { unique: true });
neighborhoodFavoriteSchema.index({ providerId: 1, locality: 1 });

export const NeighborhoodFavorite = mongoose.model('NeighborhoodFavorite', neighborhoodFavoriteSchema);
