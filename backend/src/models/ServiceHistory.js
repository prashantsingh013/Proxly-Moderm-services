import mongoose from 'mongoose';

const serviceHistorySchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  category: { type: String, required: true }, // e.g. 'Air Conditioner', 'Washing Machine', 'RO Water Purifier', 'Geyser'
  applianceName: { type: String, required: true }, // e.g. 'Master Bedroom AC', 'Kitchen RO'
  brand: { type: String, default: 'Daikin' },
  locationLabel: { type: String, default: 'Home' },
  date: { type: Date, required: true, default: Date.now },
  cost: { type: Number, required: true },
  repairType: {
    type: String,
    enum: ['routine_service', 'spot_fix', 'part_replacement', 'diagnostic_overhaul', 'installation'],
    default: 'routine_service'
  },
  partsReplaced: [{ type: String }],
  warrantyExpiryDate: { type: Date },
  invoiceUrl: { type: String, default: '' },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

serviceHistorySchema.index({ customerId: 1, category: 1, date: -1 });

export const ServiceHistory = mongoose.model('ServiceHistory', serviceHistorySchema);
