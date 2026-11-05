import { mockStore } from '../data/mockStore.js';

export const createBooking = async (req, res) => {
  try {
    const { category, serviceName, description, locality = 'Indiranagar', isEmergency = false, targetProviderId } = req.body;
    const bookingId = `bk_${Date.now()}`;
    const targetProv = targetProviderId ? mockStore.providers.find(p => p._id === targetProviderId) : null;

    const newBooking = {
      _id: bookingId,
      customerId: req.user,
      providerId: targetProv,
      category,
      serviceName: serviceName || `${category} Service`,
      description,
      locality,
      addressText: `100ft Road, ${locality}, Bangalore`,
      isEmergency,
      status: targetProviderId ? 'CONFIRMED' : 'REQUESTED',
      finalAmount: targetProv ? targetProv.hourlyRate + 150 : 0,
      createdAt: new Date(),
      statusHistory: [
        { status: targetProviderId ? 'CONFIRMED' : 'REQUESTED', timestamp: new Date(), actor: 'customer', note: 'Booking initiated' }
      ],
      escrow: {
        amount: targetProv ? targetProv.hourlyRate + 150 : 0,
        status: targetProviderId ? 'held' : 'unfunded',
        heldAt: new Date()
      }
    };

    mockStore.bookings.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let list = [...mockStore.bookings];
    if (status) list = list.filter(b => b.status === status);

    return res.status(200).json({
      success: true,
      count: list.length,
      bookings: list
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = mockStore.bookings.find(b => b._id === id) || mockStore.bookings[0];
    const quotations = mockStore.quotations.filter(q => q.bookingId === booking._id || q.bookingId === id);

    return res.status(200).json({
      success: true,
      booking,
      quotations: quotations.length > 0 ? quotations : mockStore.quotations.slice(0, 3)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch booking details' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const booking = mockStore.bookings.find(b => b._id === req.params.id) || mockStore.bookings[0];
    booking.status = status;
    booking.statusHistory.push({
      status,
      timestamp: new Date(),
      actor: req.user?.role || 'provider',
      note: note || `Status updated to ${status}`
    });

    return res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      booking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

export const releaseEscrow = async (req, res) => {
  try {
    const booking = mockStore.bookings.find(b => b._id === req.params.id) || mockStore.bookings[0];
    booking.escrow.status = 'released';
    booking.escrow.releasedAt = new Date();
    booking.status = 'COMPLETED';
    booking.statusHistory.push({
      status: 'COMPLETED',
      timestamp: new Date(),
      actor: 'customer',
      note: `Escrow payment of ₹${booking.escrow.amount} released to provider.`
    });

    return res.status(200).json({
      success: true,
      message: 'Escrow payment released successfully to provider.',
      booking
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Failed to release escrow' });
  }
};

export const disputeBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = mockStore.bookings.find(b => b._id === req.params.id) || mockStore.bookings[0];
    booking.escrow.status = 'disputed';
    booking.escrow.disputeReason = reason;
    booking.status = 'DISPUTED';
    booking.statusHistory.push({
      status: 'DISPUTED',
      timestamp: new Date(),
      actor: 'customer',
      note: `Dispute opened: ${reason}. Escrow funds frozen.`
    });

    return res.status(200).json({
      success: true,
      message: 'Dispute opened. Escrow funds frozen.',
      booking
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Failed to raise dispute' });
  }
};
