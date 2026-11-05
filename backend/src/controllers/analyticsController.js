import { mockStore } from '../data/mockStore.js';

export const getAdminAnalytics = async (req, res) => {
  try {
    const histogramData = [
      { range: '90-100 (Elite)', count: 8 },
      { range: '80-89 (Highly Trusted)', count: 14 },
      { range: '70-79 (Trusted)', count: 7 },
      { range: '60-69 (Moderate)', count: 2 },
      { range: '<60 (Building)', count: 1 }
    ];

    const tierData = [
      { tier: 'Locally Endorsed', count: 8 },
      { tier: 'Community Verified', count: 12 },
      { tier: 'Document Verified', count: 9 },
      { tier: 'Unverified', count: 3 }
    ];

    return res.status(200).json({
      success: true,
      summary: {
        totalUsers: mockStore.users.length,
        totalCustomers: mockStore.users.filter(u => u.role === 'customer').length,
        totalProviders: mockStore.providers.length,
        totalBookings: mockStore.bookings.length,
        totalEndorsements: mockStore.endorsements.length,
        totalReports: mockStore.reports.length,
        pendingReports: mockStore.reports.filter(r => r.status === 'pending').length,
        resolvedReports: mockStore.reports.filter(r => r.status !== 'pending').length
      },
      trustScoreHistogram: histogramData,
      tierDistribution: tierData,
      escrowMetrics: {
        heldAmount: 4850,
        heldCount: 6,
        releasedAmount: 28400,
        releasedCount: 42,
        disputedAmount: 600,
        disputedCount: 1,
        refundedAmount: 450,
        refundedCount: 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to generate analytics' });
  }
};
