import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  addressLine: { type: String, required: true },
  locality: { type: String, default: 'Indiranagar' },
  city: { type: String, default: 'Bangalore' },
  pincode: { type: String, default: '560038' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true, default: [77.6408, 12.9784] } // [longitude, latitude]
  }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  preferredLanguage: { type: String, enum: ['en', 'hi', 'kn', 'ta', 'te'], default: 'en' },
  addresses: [addressSchema],
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
