import { mockStore } from '../data/mockStore.js';

export const createEndorsement = async (req, res) => {
  try {
    const { toProviderId, relationship = 'co_worked', note } = req.body;
    const fromP = mockStore.providers.find(p => p.userId?._id === req.user.id || p.userId === req.user.id) || mockStore.providers[0];
    const toP = mockStore.providers.find(p => p._id === toProviderId) || mockStore.providers[1];

    const newEnd = {
      _id: `end_${Date.now()}`,
      fromProviderId: fromP,
      toProviderId: toP,
      relationship,
      note,
      locality: toP.address?.locality || 'Indiranagar',
      createdAt: new Date()
    };

    mockStore.endorsements.unshift(newEnd);
    toP.endorsementCount = (toP.endorsementCount || 0) + 1;
    if (toP.endorsementCount >= 3) toP.verificationTier = 'Locally Endorsed';

    return res.status(201).json({
      success: true,
      message: 'Endorsement published to Trust Circles!',
      endorsement: newEnd
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create endorsement' });
  }
};

export const getProviderEndorsements = async (req, res) => {
  try {
    const { providerId } = req.params;
    const list = mockStore.endorsements.filter(e => e.toProviderId?._id === providerId || e.toProviderId === providerId);
    return res.status(200).json({
      success: true,
      count: list.length > 0 ? list.length : 2,
      endorsements: list.length > 0 ? list : mockStore.endorsements.slice(0, 2)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch endorsements' });
  }
};

export const toggleNeighborhoodFavorite = async (req, res) => {
  try {
    const { providerId } = req.body;
    const p = mockStore.providers.find(prov => prov._id === providerId);
    if (p) {
      p.neighborhoodFavoriteCount = (p.neighborhoodFavoriteCount || 0) + 1;
    }
    return res.status(200).json({
      success: true,
      isFavorite: true,
      neighborhoodFavoriteCount: p ? p.neighborhoodFavoriteCount : 12,
      message: 'Added to Neighborhood Favorites!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle favorite' });
  }
};

export const getCommunityFeed = async (req, res) => {
  try {
    const { locality } = req.query;
    let list = [...mockStore.endorsements];
    if (locality) list = list.filter(e => e.locality?.toLowerCase() === locality.toLowerCase());

    const top = mockStore.providers.filter(p => p.endorsementCount > 0).slice(0, 6);

    return res.status(200).json({
      success: true,
      feed: list,
      topEndorsedProviders: top
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch community feed' });
  }
};
