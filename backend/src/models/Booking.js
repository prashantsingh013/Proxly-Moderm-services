import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  actor: { type: String, default: 'system' }, // 'customer', 'provider', 'admin', 'system'
  note: { type: String, default: '' }
}, { _id: false });

const escrowSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['unfunded', 'held', 'released', 'disputed', 'refunded'],
    default: 'unfunded'
  },
  heldAt: { type: Date },
  releasedAt: { type: Date },
  autoReleaseDate: { type: Date }, // 48 hours after COMPLETED
  disputeReason: { type: String, default: '' },
  disputeOpenedBy: { type: String, enum: ['customer', 'provider', 'admin', ''], default: '' },
  disputeOpenedAt: { type: Date },
  disputeResolvedAt: { type: Date },
  resolutionNotes: { type: String, default: '' }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', index: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  category: { type: String, required: true },
  serviceName: { type: String, required: true },
  description: { type: String, default: '' },
  voiceAudioUrl: { type: String, default: '' },
  
  // Location of service delivery
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  addressText: { type: String, required: true },
  locality: { type: String, default: 'Indiranagar' },
  city: { type: String, default: 'Bangalore' },

  // Emergency Mode info
  isEmergency: { type: Boolean, default: false, index: true },
  emergencyDetails: {
    surchargePercent: { type: Number, default: 0 },
    flatFee: { type: Number, default: 0 },
    baseEstimatedCost: { type: Number, default: 0 },
    totalEstimatedCost: { type: Number, default: 0 },
    radiusLevel: { type: Number, default: 1 }, // 1: 5km, 2: 10km, 3: 20km
    etaMinutes: { type: Number, default: 30 }
  },

  scheduledDate: { type: Date, default: Date.now },
  preferredTimeSlot: { type: String, default: 'Immediate' },

  // State Machine: REQUESTED -> QUOTATIONS_RECEIVED -> CONFIRMED -> PROVIDER_ON_THE_WAY -> IN_PROGRESS -> COMPLETED
  // Alternate: CANCELLED, DISPUTED
  status: {
    type: String,
    enum: [
      'REQUESTED',
      'QUOTATIONS_RECEIVED',
      'CONFIRMED',
      'PROVIDER_ON_THE_WAY',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'DISPUTED'
    ],
    default: 'REQUESTED',
    index: true
  },
  statusHistory: [statusHistorySchema],

  // Payment & Escrow
  escrow: { type: escrowSchema, default: () => ({}) },
  acceptedQuotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
  finalAmount: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'SkillBridge Escrow' },
  ratingGiven: { type: Boolean, default: false }
}, {
  timestamps: true
});

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ location: '2dsphere' });

export const Booking = mongoose.model('Booking', bookingSchema);
