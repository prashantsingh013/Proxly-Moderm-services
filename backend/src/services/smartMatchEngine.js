import { Provider } from '../models/Provider.js';

/**
 * Calculates Haversine distance in kilometers between two coordinates [lng, lat]
 */
export const calculateDistanceKm = (coords1, coords2) => {
  if (!coords1 || !coords2 || coords1.length < 2 || coords2.length < 2) return 10;
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

/**
 * Computes SmartMatch score with whyRecommended & dragFactors
 */
export const rankProvidersForJob = async ({
  category,
  subCategory,
  customerLocation = [77.6408, 12.9784], // [lng, lat]
  customerBudget = { min: 300, max: 700 },
  isEmergency = false,
  maxDistanceKm = 25
}) => {
  // Query eligible providers matching category
  const filter = {
    categories: { $regex: new RegExp(category, 'i') }
  };

  if (isEmergency) {
    filter.isEmergencyAvailable = true;
  }

  const providers = await Provider.find(filter).populate('userId', 'name email avatar phone preferredLanguage');

  if (!providers || providers.length === 0) {
    return [];
  }

  const scoredProviders = providers.map(provider => {
    const coords = provider.location?.coordinates || [77.6408, 12.9784];
    const distanceKm = calculateDistanceKm(customerLocation, coords);

    // 1. TrustScore component (0-100) -> normalized (0-100)
    const trustScore = provider.trustScoreCache?.score || 70;
    const trustScoreNormalized = trustScore;

    // 2. Proximity Score: Inverse distance, capped at maxDistanceKm (0-100)
    // 0km -> 100, 5km -> 80, 10km -> 60, 20km -> 20, >25km -> 0
    const proximityScore = Math.max(0, Math.min(100, Math.round((1 - (distanceKm / maxDistanceKm)) * 100)));

    // 3. Availability Score (0-100)
    let availabilityScore = provider.availability?.isAvailableNow ? 95 : 50;
    if (isEmergency && provider.isEmergencyAvailable) availabilityScore = 100;

    // 4. Price Band Fit (0-100): Closeness to customer's stated budget
    const providerRate = provider.hourlyRate || 400;
    const targetMid = (customerBudget.min + customerBudget.max) / 2;
    const priceDiff = Math.abs(providerRate - targetMid);
    const priceBandFit = Math.max(20, Math.min(100, Math.round(100 - (priceDiff / targetMid) * 60)));

    // 5. Past Success with Similar Jobs (0-100)
    const completed = provider.completedJobsCount || 5;
    const rating = provider.baseRating || 4.5;
    const pastSuccess = Math.min(100, Math.round((completed / 50) * 40 + (rating / 5) * 60));

    // SmartMatch Weighted Formula:
    // matchScore = 0.30 * trustScoreNormalized + 0.25 * proximityScore + 0.20 * availabilityScore + 0.15 * priceBandFit + 0.10 * pastSuccess
    const rawMatchScore =
      0.30 * trustScoreNormalized +
      0.25 * proximityScore +
      0.20 * availabilityScore +
      0.15 * priceBandFit +
      0.10 * pastSuccess;

    const matchScore = Math.min(100, Math.max(10, Math.round(rawMatchScore)));

    // Generate explainable positive signals
    const whyRecommended = [];
    if (trustScore >= 85) whyRecommended.push(`🛡️ ${provider.trustScoreCache?.level || 'Highly Trusted'} (TrustScore: ${trustScore}/100)`);
    if (distanceKm <= 3) whyRecommended.push(`📍 Hyperlocal — only ${distanceKm} km away in your area`);
    else if (distanceKm <= 7) whyRecommended.push(`🚗 Nearby — ${distanceKm} km away`);
    if (provider.verificationTier === 'Locally Endorsed') whyRecommended.push(`🤝 Locally Endorsed by peer verified providers`);
    else if (provider.verificationTier === 'Community Verified') whyRecommended.push(`✅ Community Verified with zero upheld disputes`);
    if (provider.responseTimeMinutes <= 15) whyRecommended.push(`⚡ Rapid ${provider.responseTimeMinutes}m typical response`);
    if (provider.endorsementCount > 0) whyRecommended.push(`🏅 Endorsed by ${provider.endorsementCount} verified local specialists`);
    if (provider.neighborhoodFavoriteCount > 0) whyRecommended.push(`❤️ Marked as Neighborhood Favorite (${provider.neighborhoodFavoriteCount} locals)`);
    if (priceBandFit >= 80) whyRecommended.push(`💰 Great budget fit (₹${providerRate}/hr matches your preference)`);

    // Generate "Why NOT this provider" drag factors (reasoning for lower rank)
    const dragFactors = [];
    if (distanceKm > 10) dragFactors.push(`📍 Distance: ${distanceKm} km away (adds ~${Math.round(distanceKm * 2.5)}m transit time)`);
    if (trustScore < 80) dragFactors.push(`📉 TrustScore: ${trustScore}/100 is below top matches`);
    if (providerRate > customerBudget.max) dragFactors.push(`💵 Pricing: ₹${providerRate}/hr exceeds your budget ceiling of ₹${customerBudget.max}`);
    if (provider.responseTimeMinutes > 30) dragFactors.push(`⏳ Response time: average ~${provider.responseTimeMinutes} mins`);
    if (provider.cancellationRate > 5) dragFactors.push(`⚠️ Past cancellation rate: ${provider.cancellationRate}%`);
    if (provider.verificationTier === 'Unverified') dragFactors.push(`📋 Documentation pending admin verification`);

    return {
      provider,
      distanceKm,
      matchScore,
      scoreBreakdown: {
        trustScoreNormalized: Math.round(trustScoreNormalized),
        proximityScore: Math.round(proximityScore),
        availabilityScore: Math.round(availabilityScore),
        priceBandFit: Math.round(priceBandFit),
        pastSuccess: Math.round(pastSuccess)
      },
      whyRecommended: whyRecommended.slice(0, 5),
      dragFactors: dragFactors.length > 0 ? dragFactors : ['Minor rank variance in response time and proximity.']
    };
  });

  // Sort descending by matchScore
  scoredProviders.sort((a, b) => b.matchScore - a.matchScore);

  return scoredProviders;
};
