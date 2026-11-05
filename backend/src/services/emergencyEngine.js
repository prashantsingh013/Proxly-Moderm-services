import { Provider } from '../models/Provider.js';
import { calculateDistanceKm } from './smartMatchEngine.js';

/**
 * Calculates transparent emergency surcharge based on current time & dispatch rules
 */
export const calculateEmergencySurcharge = (baseAmount = 450) => {
  const now = new Date();
  const currentHour = now.getHours(); // 0 - 23

  const breakdowns = [];
  let totalPercentMultiplier = 0;
  let flatFee = 150; // Standard instant rapid dispatch fee

  breakdowns.push({
    name: 'Rapid Emergency Dispatch Fee',
    amount: flatFee,
    type: 'flat',
    reason: 'Priority allocation and instant provider rerouting'
  });

  // Late Night: 10 PM to 6 AM (22:00 to 06:00) -> +25%
  if (currentHour >= 22 || currentHour < 6) {
    const nightSurcharge = Math.round(baseAmount * 0.25);
    totalPercentMultiplier += 25;
    breakdowns.push({
      name: 'Late Night Surge (10 PM - 6 AM)',
      amount: nightSurcharge,
      percentage: 25,
      type: 'percentage',
      reason: 'Off-hours emergency night call-out'
    });
  } 
  // Peak Evening: 6 PM to 10 PM (18:00 to 22:00) -> +15%
  else if (currentHour >= 18 && currentHour < 22) {
    const peakSurcharge = Math.round(baseAmount * 0.15);
    totalPercentMultiplier += 15;
    breakdowns.push({
      name: 'Evening Peak Demand Surge',
      amount: peakSurcharge,
      percentage: 15,
      type: 'percentage',
      reason: 'High volume dispatch period'
    });
  }

  const surchargeAmount = breakdowns.reduce((sum, item) => sum + item.amount, 0);
  const totalEstimatedCost = baseAmount + surchargeAmount;

  return {
    baseAmount,
    flatFee,
    totalPercentMultiplier,
    surchargeAmount,
    totalEstimatedCost,
    breakdowns,
    transparencyNotice: 'All surcharges are locked upfront prior to dispatch confirmation with zero surprise add-ons.'
  };
};

/**
 * Finds emergency providers in expanding tiers with ETA calculations
 */
export const findEmergencyProviders = async ({
  category,
  coordinates = [77.6408, 12.9784],
  tier = 1 // 1: 5km, 2: 10km, 3: 20km
}) => {
  const radiusMap = {
    1: { maxDistMeters: 5000, maxDistKm: 5, label: 'Immediate Locality (5 km)' },
    2: { maxDistMeters: 10000, maxDistKm: 10, label: 'Extended Zone (10 km)' },
    3: { maxDistMeters: 20000, maxDistKm: 20, label: 'City-Wide Rapid Net (20 km)' }
  };

  const selectedTier = radiusMap[tier] || radiusMap[1];

  let providers = [];

  try {
    // Try MongoDB $geoNear aggregation
    providers = await Provider.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates },
          distanceField: 'distanceMeters',
          maxDistance: selectedTier.maxDistMeters,
          spherical: true,
          query: {
            isEmergencyAvailable: true,
            ...(category ? { categories: { $regex: new RegExp(category, 'i') } } : {})
          }
        }
      },
      {
        $sort: { 'trustScoreCache.score': -1, distanceMeters: 1 }
      },
      {
        $limit: 15
      }
    ]);
  } catch (err) {
    // Fallback if 2dsphere index query requires memory-based calculation
    const allEmergency = await Provider.find({
      isEmergencyAvailable: true,
      ...(category ? { categories: { $regex: new RegExp(category, 'i') } } : {})
    }).populate('userId', 'name email phone avatar');

    providers = allEmergency
      .map(p => {
        const distKm = calculateDistanceKm(coordinates, p.location?.coordinates || [77.6408, 12.9784]);
        return {
          ...p.toObject(),
          distanceMeters: distKm * 1000
        };
      })
      .filter(p => p.distanceMeters <= selectedTier.maxDistMeters)
      .sort((a, b) => (b.trustScoreCache?.score || 0) - (a.trustScoreCache?.score || 0));
  }

  // Compute realistic ETA for each provider
  const enrichedProviders = providers.map(p => {
    const distKm = Math.round((p.distanceMeters / 1000) * 10) / 10;
    // Urban traffic speed approx 25 km/h + 5 min preparation time
    const transitMinutes = Math.round((distKm / 25) * 60);
    const etaMinutes = Math.max(10, transitMinutes + 5);

    return {
      ...p,
      distanceKm: distKm,
      etaMinutes,
      etaDisplay: `${etaMinutes} mins`
    };
  });

  return {
    tier,
    radiusKm: selectedTier.maxDistKm,
    radiusLabel: selectedTier.label,
    totalFound: enrichedProviders.length,
    escalationAvailable: tier < 3,
    nextTier: tier < 3 ? tier + 1 : null,
    providers: enrichedProviders
  };
};
