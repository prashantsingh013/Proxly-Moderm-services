import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Provider } from '../models/Provider.js';
import { updateAndRecordTrustScore } from '../services/trustScoreEngine.js';
import { mockStore } from '../data/mockStore.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'skillbridge_super_secure_jwt_secret_key_2026_cse494';
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    secret,
    { expiresIn: '7d' }
  );
};

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'provider', 'admin']).default('customer'),
  phone: z.string().optional(),
  preferredLanguage: z.enum(['en', 'hi', 'kn', 'ta', 'te']).default('en'),
  businessName: z.string().optional(),
  categories: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  locality: z.string().optional(),
  city: z.string().optional(),
  coordinates: z.array(z.number()).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'customer',
      phone = '',
      preferredLanguage = 'en',
      businessName,
      categories = ['Electrician'],
      skills = [],
      hourlyRate = 350,
      locality = 'Indiranagar',
      city = 'Bangalore',
      coordinates = [77.6408, 12.9784]
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        phone,
        preferredLanguage,
        addresses: [{
          label: 'Primary',
          addressLine: `${locality}, ${city}`,
          locality,
          city,
          pincode: '560038',
          location: { type: 'Point', coordinates }
        }]
      });

      let provider = null;
      if (role === 'provider') {
        provider = await Provider.create({
          userId: user._id,
          businessName: businessName || `${name}'s Services`,
          bio: `Trusted local specialist in ${categories.join(', ')}.`,
          categories,
          skills: skills.length > 0 ? skills : ['General Maintenance', 'Diagnostics', 'Installation'],
          hourlyRate,
          location: { type: 'Point', coordinates },
          address: { street: 'Main Road', locality, city, pincode: '560038' },
          verificationTier: 'Unverified',
          isEmergencyAvailable: true,
          availability: { isAvailableNow: true }
        });
        await updateAndRecordTrustScore(provider._id, 'Initial registration baseline score');
      }

      const token = generateToken(user);
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, preferredLanguage: user.preferredLanguage, addresses: user.addresses, providerId: provider?._id }
      });
    }

    // In-Memory Mode
    const newUserId = `usr_${Date.now()}`;
    const newUser = {
      _id: newUserId,
      name,
      email: email.toLowerCase(),
      role,
      phone,
      preferredLanguage,
      addresses: [{ label: 'Primary', addressLine: `${locality}, ${city}`, locality, city, pincode: '560038', location: { coordinates } }]
    };
    mockStore.users.push(newUser);

    let providerId = null;
    if (role === 'provider') {
      providerId = `prov_${Date.now()}`;
      mockStore.providers.push({
        _id: providerId,
        userId: newUser,
        businessName: businessName || `${name}'s Services`,
        bio: `Trusted local specialist in ${categories.join(', ')}.`,
        categories,
        skills: skills.length > 0 ? skills : ['General Maintenance', 'Diagnostics'],
        hourlyRate,
        location: { type: 'Point', coordinates },
        address: { street: 'Main Road', locality, city, pincode: '560038' },
        verificationTier: 'Unverified',
        trustScoreCache: { score: 75, level: 'Trusted', factors: { rating: 4.5, completedJobs: 5, completionRate: 95, cancellationRate: 2, responseTimeMinutes: 15, verificationBonus: 20 } },
        isEmergencyAvailable: true
      });
    }

    const token = generateToken(newUser);
    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone, preferredLanguage: newUser.preferredLanguage, addresses: newUser.addresses, providerId }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          let provider = null;
          if (user.role === 'provider') {
            provider = await Provider.findOne({ userId: user._id });
          }
          const token = generateToken(user);
          return res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, preferredLanguage: user.preferredLanguage, addresses: user.addresses, providerId: provider?._id, providerDetails: provider }
          });
        }
      }
    }

    // In-Memory Fallback Check
    const memUser = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (memUser) {
      // Allow password123 or admin123 for demo logins
      const prov = mockStore.providers.find(p => p.userId?._id === memUser._id || p.userId === memUser._id);
      const token = generateToken(memUser);
      return res.status(200).json({
        success: true,
        token,
        user: { id: memUser._id, name: memUser.name, email: memUser.email, role: memUser.role, phone: memUser.phone, preferredLanguage: memUser.preferredLanguage, addresses: memUser.addresses, providerId: prov?._id, providerDetails: prov }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('-passwordHash');
      if (user) {
        let provider = null;
        if (user.role === 'provider') {
          provider = await Provider.findOne({ userId: user._id });
        }
        return res.status(200).json({ success: true, user: { ...user.toObject(), providerId: provider?._id, providerDetails: provider } });
      }
    }

    const memUser = mockStore.users.find(u => u._id === req.user.id || u._id === req.user._id);
    const prov = mockStore.providers.find(p => p.userId?._id === req.user.id || p.userId === req.user.id);
    return res.status(200).json({
      success: true,
      user: { ...(memUser || req.user), providerId: prov?._id, providerDetails: prov }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, preferredLanguage, addresses } = req.body;
    return res.status(200).json({
      success: true,
      message: 'Profile updated',
      user: { id: req.user.id, name: name || req.user.name, email: req.user.email, role: req.user.role, phone, preferredLanguage, addresses }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};
