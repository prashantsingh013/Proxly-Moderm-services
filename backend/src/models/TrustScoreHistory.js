import mongoose from 'mongoose';

const trustScoreHistorySchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  date: { type: Date, required: true, default: Date.now },
  score: { type: Number, required: true },
  level: { type: String, required: true },
  factorsSnapshot: {
    rating: { type: Number, required: true },
    completedJobs: { type: Number, required: true },
    completionRate: { type: Number, required: true },
    cancellationRate: { type: Number, required: true },
    responseTime: { type: Number, required: true },
    verified: { type: Boolean, required: true },
    repeatCustomerRate: { type: Number, default: 0 },
    penaltiesDecayed: { type: Number, default: 0 }
  },
  delta: { type: Number, default: 0 }, // change from previous snapshot
  note: { type: String, default: 'Periodic automated recalculation' }
}, {
  timestamps: true
});

trustScoreHistorySchema.index({ providerId: 1, date: -1 });

export const TrustScoreHistory = mongoose.model('TrustScoreHistory', trustScoreHistorySchema);
