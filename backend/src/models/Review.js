import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  subRatings: {
    timeliness: { type: Number, min: 1, max: 5, default: 5 },
    workmanship: { type: Number, min: 1, max: 5, default: 5 },
    behavior: { type: Number, min: 1, max: 5, default: 5 },
    pricingTransparency: { type: Number, min: 1, max: 5, default: 5 }
  },
  comment: { type: String, required: true, trim: true },
  isVerifiedJob: { type: Boolean, default: true },
  flagged: { type: Boolean, default: false },
  providerResponse: { type: String, default: '' },
  providerResponseAt: { type: Date }
}, {
  timestamps: true
});

reviewSchema.index({ providerId: 1, createdAt: -1 });

export const Review = mongoose.model('Review', reviewSchema);
