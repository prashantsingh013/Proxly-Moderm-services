import { mockStore } from '../data/mockStore.js';

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const revId = `rev_${Date.now()}`;
    const newRev = {
      _id: revId,
      bookingId,
      customerId: req.user,
      rating: parseFloat(rating),
      comment,
      createdAt: new Date()
    };
    mockStore.reviews.push(newRev);

    const booking = mockStore.bookings.find(b => b._id === bookingId);
    if (booking) booking.ratingGiven = true;

    return res.status(201).json({
      success: true,
      message: 'Review published. TrustScore updated.',
      review: newRev
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create review' });
  }
};

export const getProviderReviews = async (req, res) => {
  return res.status(200).json({
    success: true,
    total: 2,
    reviews: [
      { _id: 'rev_1', rating: 5, comment: 'Punctual arrival and transparent pricing. 30-day warranty handed over.', customerId: { name: 'Aarav Sharma' }, createdAt: new Date() },
      { _id: 'rev_2', rating: 4.8, comment: 'Fixed the issue rapidly with genuine spare parts.', customerId: { name: 'Priya Iyer' }, createdAt: new Date() }
    ]
  });
};

export const replyToReview = async (req, res) => {
  return res.status(200).json({ success: true, message: 'Reply saved' });
};
