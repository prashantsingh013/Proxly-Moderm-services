import { mockStore } from '../data/mockStore.js';

export const createQuotation = async (req, res) => {
  try {
    const { bookingId, priceExact, etaMinutes = 45, warrantyDays = 30, notes } = req.body;
    const provider = mockStore.providers.find(p => p.userId?._id === req.user.id || p.userId === req.user.id) || mockStore.providers[0];

    const quoteId = `qt_${Date.now()}`;
    const newQuote = {
      _id: quoteId,
      bookingId,
      providerId: provider,
      priceRange: { min: priceExact - 50, max: priceExact + 100, exact: priceExact },
      etaMinutes,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
      warrantyDays,
      notes: notes || 'Includes 30-day workmanship guarantee.',
      status: 'pending'
    };

    mockStore.quotations.push(newQuote);

    const booking = mockStore.bookings.find(b => b._id === bookingId);
    if (booking && booking.status === 'REQUESTED') {
      booking.status = 'QUOTATIONS_RECEIVED';
    }

    return res.status(201).json({
      success: true,
      message: 'Quotation submitted successfully with warranty lock',
      quotation: newQuote
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit quotation' });
  }
};

export const getQuotationsForBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const quotations = mockStore.quotations.filter(q => q.bookingId === bookingId);
    return res.status(200).json({
      success: true,
      count: quotations.length > 0 ? quotations.length : 3,
      quotations: quotations.length > 0 ? quotations : mockStore.quotations.slice(0, 3)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch quotations' });
  }
};

export const acceptQuotation = async (req, res) => {
  try {
    const { quotationId } = req.body;
    const booking = mockStore.bookings.find(b => b._id === req.params.bookingId) || mockStore.bookings[0];
    const quotation = mockStore.quotations.find(q => q._id === quotationId) || mockStore.quotations[0];

    quotation.status = 'accepted';
    booking.providerId = quotation.providerId;
    booking.finalAmount = quotation.priceRange.exact || quotation.priceRange.min;
    booking.status = 'CONFIRMED';
    booking.escrow = {
      amount: booking.finalAmount,
      status: 'held',
      heldAt: new Date()
    };
    booking.statusHistory.push({
      status: 'CONFIRMED',
      timestamp: new Date(),
      actor: 'customer',
      note: `Quotation accepted. ₹${booking.finalAmount} locked securely in SkillBridge Escrow.`
    });

    return res.status(200).json({
      success: true,
      message: 'Quotation accepted! Payment locked in escrow.',
      booking
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Failed to accept quotation' });
  }
};
