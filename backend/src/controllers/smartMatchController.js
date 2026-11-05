import { mockStore } from '../data/mockStore.js';
import { calculateDistanceKm } from '../services/smartMatchEngine.js';

export const getSmartMatches = async (req, res) => {
  try {
    const {
      category = 'Electrician',
      lng = 77.6408,
      lat = 12.9784,
      minBudget = 300,
      maxBudget = 800,
      isEmergency = false
    } = req.query;

    const customerCoords = [parseFloat(lng), parseFloat(lat)];

    let eligible = mockStore.providers.filter(p =>
      p.categories.some(c => c.toLowerCase().includes(category.toLowerCase()))
    );

    if (eligible.length === 0) {
      eligible = mockStore.providers;
    }

    const matches = eligible.map(provider => {
      const coords = provider.location?.coordinates || [77.6408, 12.9784];
      const distanceKm = calculateDistanceKm(customerCoords, coords);

      const trustScore = provider.trustScoreCache?.score || 80;
      const proximityScore = Math.max(10, Math.min(100, Math.round((1 - (distanceKm / 25)) * 100)));
      const availabilityScore = provider.isEmergencyAvailable ? 95 : 75;
      const rate = provider.hourlyRate || 400;
      const priceBandFit = Math.max(30, 100 - Math.abs(rate - (Number(minBudget) + Number(maxBudget)) / 2) / 10);
      const pastSuccess = Math.min(100, Math.round((provider.completedJobsCount / 40) * 35 + (provider.baseRating / 5) * 65));

      const rawScore = 0.30 * trustScore + 0.25 * proximityScore + 0.20 * availabilityScore + 0.15 * priceBandFit + 0.10 * pastSuccess;
      const matchScore = Math.min(99, Math.max(45, Math.round(rawScore)));

      const whyRecommended = [
        `🛡️ ${provider.trustScoreCache?.level || 'Highly Trusted'} (TrustScore: ${trustScore}/100)`,
        `📍 Hyperlocal — ${distanceKm} km away in ${provider.address?.locality || 'Bangalore'}`,
        `⚡ ~${provider.responseTimeMinutes || 12}m typical response speed`,
        `💰 ₹${rate}/hr fits your ₹${minBudget}-₹${maxBudget} budget preference`
      ];

      if (provider.verificationTier === 'Locally Endorsed') {
        whyRecommended.push('🤝 Locally Endorsed by 4 neighborhood specialist peers');
      }

      const dragFactors = [
        `📍 Distance: ${distanceKm} km transit overhead`,
        `📉 TrustScore: ${trustScore}/100 vs leaderboards`,
        `💵 Hourly rate: ₹${rate}/hr vs baseline`
      ];

      return {
        provider,
        distanceKm,
        matchScore,
        whyRecommended,
        dragFactors
      };
    });

    matches.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      category,
      customerLocation: customerCoords,
      count: matches.length,
      matches
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'SmartMatch computation failed', error: error.message });
  }
};
