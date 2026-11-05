import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  docType: { type: String, required: true }, // 'national_id', 'trade_license', 'police_clearance', 'skill_certificate'
  docUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verifiedAt: { type: Date }
}, { _id: false });

const scheduleDaySchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
  startTime: { type: String, default: '08:00' },
  endTime: { type: String, default: '20:00' },
  isAvailable: { type: Boolean, default: true }
}, { _id: false });

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  businessName: { type: String, required: true, trim: true },
  bio: { type: String, default: '' },
  categories: [{ type: String, required: true, index: true }], // e.g. ['Electrician', 'Appliance Repair']
  skills: [{ type: String }],
  experienceYears: { type: Number, default: 2 },
  hourlyRate: { type: Number, default: 350 },
  
  // Geospatial Location (Point: [longitude, latitude])
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  address: {
    street: { type: String, default: '' },
    locality: { type: String, default: 'Indiranagar' },
    city: { type: String, default: 'Bangalore' },
    pincode: { type: String, default: '560038' }
  },
  serviceRadiusKm: { type: Number, default: 15 },

  // Verification Tiers: Unverified -> Document Verified -> Community Verified -> Locally Endorsed
  verificationTier: {
    type: String,
    enum: ['Unverified', 'Document Verified', 'Community Verified', 'Locally Endorsed'],
    default: 'Unverified'
  },
  documents: [documentSchema],
  
  // Explainable TrustScore cache & stats
  trustScoreCache: {
    score: { type: Number, default: 75 },
    level: { type: String, default: 'Trusted' }, // 'New Provider', 'Trusted', 'Highly Trusted', 'Elite Champion'
    lastCalculatedAt: { type: Date, default: Date.now },
    factors: {
      rating: { type: Number, default: 4.5 },
      completedJobs: { type: Number, default: 10 },
      completionRate: { type: Number, default: 95 },
      cancellationRate: { type: Number, default: 2 },
      responseTime: { type: Number, default: 15 }, // minutes
      verified: { type: Boolean, default: false },
      repeatCustomerRate: { type: Number, default: 20 }, // percent
      accountAgeDays: { type: Number, default: 60 }
    }
  },

  baseRating: { type: Number, default: 4.5 },
  totalReviews: { type: Number, default: 0 },
  completedJobsCount: { type: Number, default: 0 },
  cancellationRate: { type: Number, default: 0 },
  responseTimeMinutes: { type: Number, default: 15 },
  repeatCustomerCount: { type: Number, default: 0 },
  
  // Emergency Mode Capabilities
  isEmergencyAvailable: { type: Boolean, default: false, index: true },
  emergencySurchargePercent: { type: Number, default: 20 },
  emergencyBaseFee: { type: Number, default: 150 },

  // Availability
  availability: {
    weeklySchedule: [scheduleDaySchema],
    isAvailableNow: { type: Boolean, default: true, index: true }
  },

  // Trust Circles
  endorsementCount: { type: Number, default: 0 },
  neighborhoodFavoriteCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes
providerSchema.index({ location: '2dsphere' });
providerSchema.index({ categories: 1, 'availability.isAvailableNow': 1 });
providerSchema.index({ categories: 1, isEmergencyAvailable: 1 });
providerSchema.index({ 'trustScoreCache.score': -1 });

export const Provider = mongoose.model('Provider', providerSchema);
