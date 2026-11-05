import { mockStore } from '../data/mockStore.js';

export const getProviderTrustScore = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = mockStore.providers.find(p => p._id === providerId) || mockStore.providers[0];

    const cache = provider.trustScoreCache || {};
    const factors = cache.factors || {
      rating: 4.9,
      normalizedRating: 98,
      completedJobs: 184,
      completionRate: 99,
      cancellationRate: 1,
      responseTimeMinutes: 10,
      responseTimeScore: 100,
      verificationTier: 'Locally Endorsed',
      verificationBonus: 100,
      repeatCustomerRate: 28,
      accountAgeScore: 90,
      reportPenalty: 0,
      reportCount: 0
    };

    return res.status(200).json({
      success: true,
      trustScore: {
        providerId: provider._id,
        businessName: provider.businessName,
        score: cache.score || 94,
        level: cache.level || 'Elite Champion',
        factors,
        lastCalculatedAt: new Date()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'TrustScore fetch failed', error: error.message });
  }
};

export const getProviderTrustHistory = async (req, res) => {
  try {
    const { providerId } = req.params;
    const history = mockStore.trustScoreHistory.filter(h => h.providerId === providerId);
    const provider = mockStore.providers.find(p => p._id === providerId) || mockStore.providers[0];

    return res.status(200).json({
      success: true,
      provider,
      count: history.length > 0 ? history.length : 5,
      history: history.length > 0 ? history : mockStore.trustScoreHistory.slice(0, 5)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Trust history fetch failed', error: error.message });
  }
};

export const recalculateTrustScore = async (req, res) => {
  return res.status(200).json({ success: true, message: 'TrustScore recalculated' });
};
