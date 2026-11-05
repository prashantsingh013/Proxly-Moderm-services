import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: [
      'quotation_received',
      'quotation_accepted',
      'booking_confirmed',
      'provider_dispatched',
      'job_completed',
      'escrow_held',
      'escrow_released',
      'dispute_opened',
      'dispute_resolved',
      'endorsement_received',
      'predictive_maintenance_alert',
      'emergency_broadcast',
      'trust_score_update',
      'general'
    ],
    default: 'general'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
