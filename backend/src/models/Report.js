import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  reportedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['customer', 'provider'], required: true },
    name: { type: String, default: '' }
  },
  reportedAgainst: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    role: { type: String, enum: ['customer', 'provider'], required: true },
    name: { type: String, default: '' }
  },
  reportType: {
    type: String,
    enum: [
      'no_show',
      'abusive_behavior',
      'fake_booking',
      'poor_workmanship',
      'overcharging',
      'property_damage',
      'harassment',
      'other'
    ],
    required: true
  },
  reason: { type: String, required: true },
  evidenceUrls: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'investigating', 'upheld', 'dismissed'],
    default: 'pending'
  },
  penaltyApplied: { type: Boolean, default: false },
  penaltyScore: { type: Number, default: 0 },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date },
  adminNotes: { type: String, default: '' }
}, {
  timestamps: true
});

reportSchema.index({ 'reportedAgainst.userId': 1, status: 1 });
reportSchema.index({ 'reportedAgainst.providerId': 1, status: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model('Report', reportSchema);
