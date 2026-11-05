import mongoose from 'mongoose';

const endorsementSchema = new mongoose.Schema({
  fromProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  toProviderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true, index: true },
  relationship: {
    type: String,
    enum: ['co_worked', 'referred', 'local_peer', 'master_apprentice'],
    default: 'co_worked'
  },
  note: { type: String, required: true, trim: true },
  skillsVouched: [{ type: String }],
  locality: { type: String, default: 'Indiranagar' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

endorsementSchema.index({ fromProviderId: 1, toProviderId: 1 }, { unique: true });
endorsementSchema.index({ toProviderId: 1, createdAt: -1 });

export const Endorsement = mongoose.model('Endorsement', endorsementSchema);
