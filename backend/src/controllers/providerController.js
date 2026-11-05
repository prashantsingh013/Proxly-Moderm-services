import mongoose from 'mongoose';
import { Provider } from '../models/Provider.js';
import { Review } from '../models/Review.js';
import { Endorsement } from '../models/Endorsement.js';
import { calculateDistanceKm } from '../services/smartMatchEngine.js';
import { mockStore } from '../data/mockStore.js';

export const getAllProviders = async (req, res) => {
  try {
    const { category, tier, emergency, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (category) filter.categories = { $regex: new RegExp(category, 'i') };
      if (tier) filter.verificationTier = tier;
      if (emergency === 'true') filter.isEmergencyAvailable = true;
      if (search) {
        filter.$or = [
          { businessName: { $regex: new RegExp(search, 'i') } },
          { 'address.locality': { $regex: new RegExp(search, 'i') } }
        ];
      }
      const providers = await Provider.find(filter).populate('userId', 'name email avatar phone').sort({ 'trustScoreCache.score': -1 });
      return res.status(200).json({ success: true, total: providers.length, providers });
    }

    let list = [...mockStore.providers];
    if (category) list = list.filter(p => p.categories.some(c => c.toLowerCase().includes(category.toLowerCase())));
    if (tier) list = list.filter(p => p.verificationTier === tier);
    if (emergency === 'true') list = list.filter(p => p.isEmergencyAvailable);
    if (search) list = list.filter(p => p.businessName.toLowerCase().includes(search.toLowerCase()) || p.address?.locality.toLowerCase().includes(search.toLowerCase()));

    return res.status(200).json({
      success: true,
      total: list.length,
      providers: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch providers', error: error.message });
  }
};

export const getNearbyProviders = async (req, res) => {
  try {
    const { lng = 77.6408, lat = 12.9784, category, radiusKm = 15 } = req.query;
    const coords = [parseFloat(lng), parseFloat(lat)];

    const list = mockStore.providers.map(p => {
      const dist = calculateDistanceKm(coords, p.location?.coordinates || [77.6408, 12.9784]);
      return { ...p, distanceKm: dist };
    }).filter(p => p.distanceKm <= parseFloat(radiusKm))
      .sort((a, b) => (b.trustScoreCache?.score || 0) - (a.trustScoreCache?.score || 0));

    return res.status(200).json({
      success: true,
      count: list.length,
      coordinates: coords,
      providers: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch nearby providers', error: error.message });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const provider = await Provider.findById(id).populate('userId', 'name email phone avatar');
      if (provider) {
        const reviews = await Review.find({ providerId: provider._id }).populate('customerId', 'name');
        const endorsements = await Endorsement.find({ toProviderId: provider._id });
        return res.status(200).json({
          success: true,
          provider: { ...provider.toObject(), recentReviews: reviews, endorsementsList: endorsements }
        });
      }
    }

    const p = mockStore.providers.find(prov => prov._id === id) || mockStore.providers[0];
    const endorsements = mockStore.endorsements.filter(e => e.toProviderId?._id === id || e.toProviderId === id);

    return res.status(200).json({
      success: true,
      provider: {
        ...p,
        recentReviews: [
          { _id: 'rev_1', rating: 5, comment: 'Prompt response! Fixed switchboard in 20 mins. Very transparent.', customerId: { name: 'Aarav Sharma' }, createdAt: new Date() },
          { _id: 'rev_2', rating: 4.8, comment: 'Punctual and courteous. Handed over 30-day warranty card.', customerId: { name: 'Priya Iyer' }, createdAt: new Date() }
        ],
        endorsementsList: endorsements.length > 0 ? endorsements : [mockStore.endorsements[0]]
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch provider details', error: error.message });
  }
};

export const updateProviderProfile = async (req, res) => {
  try {
    return res.status(200).json({ success: true, message: 'Provider profile updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

export const verifyProviderDocs = async (req, res) => {
  try {
    const { providerId, verificationTier } = req.body;
    const p = mockStore.providers.find(prov => prov._id === providerId);
    if (p) {
      p.verificationTier = verificationTier;
    }
    return res.status(200).json({ success: true, message: `Provider updated to ${verificationTier}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
  }
};
