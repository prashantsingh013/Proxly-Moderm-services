import { Provider } from '../models/Provider.js';
import { Report } from '../models/Report.js';
import { TrustScoreHistory } from '../models/TrustScoreHistory.js';

/**
 * Calculates response time score (0-100) based on average minutes
 */
export const calculateResponseTimeScore = (minutes = 15) => {
  if (minutes <= 10) return 100;
  if (minutes <= 20) return 90;
  if (minutes <= 30) return 80;
  if (minutes <= 60) return 65;
  if (minutes <= 120) return 45;
  return 30;
};

/**
 * Calculates verification bonus based on 4-tier model (0-100)
 */
export const calculateVerificationBonus = (tier = 'Unverified') => {
  switch (tier) {
    case 'Locally Endorsed':
      return 100;
    case 'Community Verified':
      return 85;
    case 'Document Verified':
      return 60;
    case 'Unverified':
    default:
      return 20;
  }
};

/**
 * Calculates account age score (0-100) based on days registered
 */
export const calculateAccountAgeScore = (createdAt) => {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(100, Math.max(10, Math.round((days / 180) * 100)));
};

/**
 * Calculates report penalty with exponential decay (halves every 90 days)
 */
export const calculateReportPenalty = async (providerId, userId) => {
  const reports = await Report.find({
    $or: [
      { 'reportedAgainst.providerId': providerId },
      { 'reportedAgainst.userId': userId }
    ],
    status: 'upheld'
  });

  if (!reports || reports.length === 0) return { penalty: 0, count: 0 };

  const now = Date.now();
  const DECAY_CONSTANT = 0.0077; // ln(2) / 90 days ≈ 0.007704

  let totalDecayedPenalty = 0;

  reports.forEach(report => {
    const daysElapsed = Math.max(0, (now - new Date(report.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const decayFactor = Math.exp(-DECAY_CONSTANT * daysElapsed);
    const basePenalty = report.penaltyScore || 15;
    totalDecayedPenalty += basePenalty * decayFactor;
  });

  // Cap total penalty at 40 points
  const cappedPenalty = Math.min(40, Math.round(totalDecayedPenalty * 10) / 10);
  return { penalty: cappedPenalty, count: reports.length };
};

/**
 * Computes full explainable TrustScore for a provider
 */
export const calculateTrustScore = async (providerId) => {
  const provider = await Provider.findById(providerId).populate('userId');
  if (!provider) throw new Error('Provider not found');

  const rating = provider.baseRating || 4.5;
  const normalizedRating = Math.min(100, Math.max(0, (rating / 5) * 100));

  const completedJobs = provider.completedJobsCount || 0;
  const cancellationRate = Math.min(100, Math.max(0, provider.cancellationRate || 0));
  const completionRate = Math.min(100, Math.max(0, 100 - cancellationRate));

  const responseTimeMinutes = provider.responseTimeMinutes || 15;
  const responseTimeScore = calculateResponseTimeScore(responseTimeMinutes);

  const verificationTier = provider.verificationTier || 'Unverified';
  const verificationBonus = calculateVerificationBonus(verificationTier);

  const repeatCustomerRate = Math.min(100, Math.max(0, provider.repeatCustomerCount ? (provider.repeatCustomerCount / Math.max(1, completedJobs)) * 100 : 20));

  const accountAgeScore = calculateAccountAgeScore(provider.createdAt || Date.now());

  // Penalties with exponential decay
  const { penalty: reportPenalty, count: reportCount } = await calculateReportPenalty(provider._id, provider.userId?._id);

  // Exact weighted formula from specification:
  // score = 0.25 * normalizedRating + 0.20 * completionRate + 0.15 * (1 - cancellationRate) + 0.15 * responseTimeScore + 0.10 * verificationBonus + 0.10 * repeatCustomerRate + 0.05 * accountAgeScore - reportPenalty
  const rawScore = 
    (0.25 * normalizedRating) +
    (0.20 * completionRate) +
    (0.15 * (100 - cancellationRate)) +
    (0.15 * responseTimeScore) +
    (0.10 * verificationBonus) +
    (0.10 * repeatCustomerRate) +
    (0.05 * accountAgeScore) -
    reportPenalty;

  const finalScore = Math.min(99, Math.max(20, Math.round(rawScore)));

  let level = 'Trusted';
  if (finalScore >= 90) level = 'Elite Champion';
  else if (finalScore >= 80) level = 'Highly Trusted';
  else if (finalScore >= 65) level = 'Trusted';
  else level = 'Building Trust';

  const factors = {
    rating: Math.round(rating * 10) / 10,
    normalizedRating: Math.round(normalizedRating),
    completedJobs,
    completionRate: Math.round(completionRate),
    cancellationRate: Math.round(cancellationRate),
    responseTimeMinutes,
    responseTimeScore: Math.round(responseTimeScore),
    verificationTier,
    verificationBonus: Math.round(verificationBonus),
    repeatCustomerRate: Math.round(repeatCustomerRate),
    accountAgeScore: Math.round(accountAgeScore),
    reportCount,
    reportPenalty: Math.round(reportPenalty * 10) / 10
  };

  const weights = {
    normalizedRating: 0.25,
    completionRate: 0.20,
    cancellationInversion: 0.15,
    responseTime: 0.15,
    verificationBonus: 0.10,
    repeatCustomerRate: 0.10,
    accountAgeScore: 0.05
  };

  return {
    providerId: provider._id,
    businessName: provider.businessName,
    score: finalScore,
    level,
    factors,
    weights,
    lastCalculatedAt: new Date()
  };
};

/**
 * Updates provider's TrustScore cache and saves a historical snapshot
 */
export const updateAndRecordTrustScore = async (providerId, note = 'Automated recalculation') => {
  const result = await calculateTrustScore(providerId);

  const provider = await Provider.findById(providerId);
  const oldScore = provider.trustScoreCache?.score || result.score;
  const delta = result.score - oldScore;

  provider.trustScoreCache = {
    score: result.score,
    level: result.level,
    lastCalculatedAt: result.lastCalculatedAt,
    factors: result.factors
  };
  await provider.save();

  // Save history snapshot
  const history = await TrustScoreHistory.create({
    providerId,
    date: new Date(),
    score: result.score,
    level: result.level,
    factorsSnapshot: result.factors,
    delta,
    note
  });

  return { result, history };
};
