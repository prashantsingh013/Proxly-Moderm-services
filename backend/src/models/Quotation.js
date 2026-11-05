import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    exact: { type: Number, required: true }
  },
  etaMinutes: { type: Number, required: true, default: 45 },
  validUntil: { type: Date, required: true }, // Mandatory quotation expiry
  warrantyDays: { type: Number, required: true, default: 30 }, // Mandatory warranty period
  notes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired'],
    default: 'pending'
  }
}, {
  timestamps: true
});

quotationSchema.index({ bookingId: 1, providerId: 1 });

export const Quotation = mongoose.model('Quotation', quotationSchema);
