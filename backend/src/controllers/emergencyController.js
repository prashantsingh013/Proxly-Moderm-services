import { calculateEmergencySurcharge } from '../services/emergencyEngine.js';
import { calculateDistanceKm } from '../services/smartMatchEngine.js';
import { mockStore } from '../data/mockStore.js';

export const getEmergencyEstimate = async (req, res) => {
  try {
    const { baseAmount = 450 } = req.query;
    const estimate = calculateEmergencySurcharge(parseFloat(baseAmount));
    return res.status(200).json({ success: true, estimate });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to estimate emergency surcharge' });
  }
};

export const searchEmergencyNearby = async (req, res) => {
  try {
    const { category = 'Electrician', lng = 77.6408, lat = 12.9784, tier = 1 } = req.query;
    const coords = [parseFloat(lng), parseFloat(lat)];

    const radiusMap = { 1: 5, 2: 10, 3: 20 };
    const maxKm = radiusMap[tier] || 5;

    const matched = mockStore.providers.filter(p => p.isEmergencyAvailable && p.categories.some(c => c.toLowerCase().includes(category.toLowerCase())));
    const list = (matched.length > 0 ? matched : mockStore.providers).map(p => {
      const dist = calculateDistanceKm(coords, p.location?.coordinates || [77.6408, 12.9784]);
      return {
        ...p,
        distanceKm: dist,
        etaDisplay: `${Math.max(10, Math.round(dist * 2.5) + 5)} mins`
      };
    }).filter(p => p.distanceKm <= maxKm);

    const surcharge = calculateEmergencySurcharge(450);

    return res.status(200).json({
      success: true,
      tier: parseInt(tier),
      radiusKm: maxKm,
      totalFound: list.length,
      escalationAvailable: tier < 3,
      providers: list,
      surchargeBreakdown: surcharge
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Emergency search failed' });
  }
};

export const requestEmergencyDispatch = async (req, res) => {
  try {
    const { category = 'Electrician', description, locality = 'Indiranagar', targetProviderId } = req.body;
    const surcharge = calculateEmergencySurcharge(450);

    const bookingId = `bk_em_${Date.now()}`;
    const newBooking = {
      _id: bookingId,
      customerId: req.user,
      providerId: targetProviderId ? mockStore.providers.find(p => p._id === targetProviderId) : mockStore.providers[0],
      category,
      serviceName: `Emergency ${category} Dispatch`,
      description: description || 'Immediate hazard breakdown dispatch',
      locality,
      addressText: `100ft Road, ${locality}, Bangalore`,
      isEmergency: true,
      status: targetProviderId ? 'CONFIRMED' : 'REQUESTED',
      finalAmount: surcharge.totalEstimatedCost,
      createdAt: new Date(),
      statusHistory: [
        { status: 'REQUESTED', timestamp: new Date(), actor: 'customer', note: `🚨 Emergency dispatch activated. Total upfront locked: ₹${surcharge.totalEstimatedCost}` }
      ],
      escrow: {
        amount: surcharge.totalEstimatedCost,
        status: targetProviderId ? 'held' : 'unfunded',
        heldAt: new Date()
      }
    };

    mockStore.bookings.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Emergency dispatch requested successfully',
      booking: newBooking,
      surchargeBreakdown: surcharge
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Emergency dispatch failed' });
  }
};
