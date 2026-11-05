import { mockStore } from '../data/mockStore.js';

export const createReport = async (req, res) => {
  try {
    const { bookingId, reportType, reason } = req.body;
    const repId = `rep_${Date.now()}`;
    const newReport = {
      _id: repId,
      bookingId,
      reportedBy: { name: req.user?.name || 'User', role: req.user?.role || 'customer' },
      reportedAgainst: { name: 'Reported Party', role: req.user?.role === 'customer' ? 'provider' : 'customer' },
      reportType,
      reason,
      status: 'pending',
      createdAt: new Date()
    };
    mockStore.reports.unshift(newReport);

    return res.status(201).json({
      success: true,
      message: 'Report filed with Trust & Safety team.',
      report: newReport
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to file report' });
  }
};

export const getAllReports = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: mockStore.reports.length,
    reports: mockStore.reports
  });
};

export const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;
    const rep = mockStore.reports.find(r => r._id === reportId);
    if (rep) {
      rep.status = status;
      rep.adminNotes = adminNotes;
    }
    return res.status(200).json({ success: true, message: `Report resolved: ${status}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to resolve report' });
  }
};
