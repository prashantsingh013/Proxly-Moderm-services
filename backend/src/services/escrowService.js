import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Provider } from '../models/Provider.js';
import { Quotation } from '../models/Quotation.js';
import { Notification } from '../models/Notification.js';

/**
 * Places funds into escrow when a quotation is accepted
 */
export const lockFundsInEscrow = async (bookingId, quotationId, customerId) => {
  const session = await mongoose.startSession();
  let useTransaction = true;

  try {
    session.startTransaction();
  } catch (err) {
    useTransaction = false; // Standalone Mongo instance without replica set
  }

  try {
    const booking = await Booking.findById(bookingId).session(useTransaction ? session : null);
    if (!booking) throw new Error('Booking not found');

    if (booking.customerId.toString() !== customerId.toString()) {
      throw new Error('Unauthorized to accept quotation for this booking');
    }

    const quotation = await Quotation.findById(quotationId).session(useTransaction ? session : null);
    if (!quotation) throw new Error('Quotation not found');

    // Update Quotations
    await Quotation.updateMany(
      { bookingId, _id: { $ne: quotationId } },
      { status: 'rejected' },
      { session: useTransaction ? session : null }
    );

    quotation.status = 'accepted';
    await quotation.save({ session: useTransaction ? session : null });

    // Lock Escrow in Booking
    const agreedAmount = quotation.priceRange.exact || quotation.priceRange.min;
    booking.providerId = quotation.providerId;
    booking.acceptedQuotationId = quotation._id;
    booking.finalAmount = agreedAmount;
    booking.status = 'CONFIRMED';
    booking.escrow = {
      amount: agreedAmount,
      status: 'held',
      heldAt: new Date(),
      autoReleaseDate: null,
      disputeReason: '',
      disputeOpenedBy: ''
    };
    booking.statusHistory.push({
      status: 'CONFIRMED',
      timestamp: new Date(),
      actor: 'customer',
      note: `Quotation accepted. ₹${agreedAmount} locked securely in SkillBridge Escrow.`
    });

    await booking.save({ session: useTransaction ? session : null });

    if (useTransaction) await session.commitTransaction();

    // Create notifications for provider
    const provider = await Provider.findById(quotation.providerId);
    if (provider) {
      await Notification.create({
        userId: provider.userId,
        type: 'escrow_held',
        title: 'New Job Confirmed — Payment Escrowed',
        message: `Customer confirmed your quotation of ₹${agreedAmount}. Funds are securely held in SkillBridge Escrow and will be released upon job completion.`,
        link: `/bookings/${booking._id}`,
        payload: { bookingId: booking._id, amount: agreedAmount }
      });
    }

    return booking;
  } catch (error) {
    if (useTransaction) await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Releases escrow funds to provider upon customer confirmation or 48h auto-release
 */
export const releaseEscrowFunds = async (bookingId, actor = 'customer', note = 'Job completed satisfactorily') => {
  const booking = await Booking.findById(bookingId).populate('providerId');
  if (!booking) throw new Error('Booking not found');

  if (booking.escrow.status === 'released') {
    return { booking, alreadyReleased: true };
  }

  if (booking.escrow.status === 'disputed' && actor !== 'admin') {
    throw new Error('Cannot release disputed funds without admin resolution');
  }

  booking.escrow.status = 'released';
  booking.escrow.releasedAt = new Date();
  booking.status = 'COMPLETED';

  booking.statusHistory.push({
    status: 'COMPLETED',
    timestamp: new Date(),
    actor,
    note: `Escrow payment of ₹${booking.escrow.amount} released to provider. ${note}`
  });

  await booking.save();

  // Notify provider of payout release
  if (booking.providerId?.userId) {
    await Notification.create({
      userId: booking.providerId.userId,
      type: 'escrow_released',
      title: '₹' + booking.escrow.amount + ' Released to Your Account',
      message: `Customer verified job completion. ₹${booking.escrow.amount} has been moved from Pending Escrow to your Released Earnings.`,
      link: `/provider/dashboard`,
      payload: { bookingId: booking._id, amount: booking.escrow.amount }
    });
  }

  return { booking, alreadyReleased: false };
};

/**
 * Raises a dispute and freezes escrow
 */
export const raiseEscrowDispute = async (bookingId, userId, role, reason) => {
  const booking = await Booking.findById(bookingId).populate('providerId');
  if (!booking) throw new Error('Booking not found');

  if (booking.escrow.status === 'released') {
    throw new Error('Funds have already been released to provider. File a community report instead.');
  }

  booking.escrow.status = 'disputed';
  booking.escrow.disputeReason = reason;
  booking.escrow.disputeOpenedBy = role;
  booking.escrow.disputeOpenedAt = new Date();
  booking.status = 'DISPUTED';

  booking.statusHistory.push({
    status: 'DISPUTED',
    timestamp: new Date(),
    actor: role,
    note: `Dispute opened by ${role}: ${reason}. Escrow funds frozen pending admin review.`
  });

  await booking.save();

  return booking;
};

/**
 * Admin dispute arbitration
 */
export const resolveEscrowDispute = async (bookingId, adminId, decision, resolutionNotes, splitPercent = 50) => {
  const booking = await Booking.findById(bookingId).populate('providerId');
  if (!booking) throw new Error('Booking not found');

  const totalAmount = booking.escrow.amount;
  booking.escrow.disputeResolvedAt = new Date();
  booking.escrow.resolutionNotes = resolutionNotes;

  if (decision === 'release_to_provider') {
    booking.escrow.status = 'released';
    booking.escrow.releasedAt = new Date();
    booking.status = 'COMPLETED';
    booking.statusHistory.push({
      status: 'COMPLETED',
      timestamp: new Date(),
      actor: 'admin',
      note: `Admin resolved dispute in favor of provider. Full amount ₹${totalAmount} released. Notes: ${resolutionNotes}`
    });
  } else if (decision === 'refund_to_customer') {
    booking.escrow.status = 'refunded';
    booking.status = 'CANCELLED';
    booking.statusHistory.push({
      status: 'CANCELLED',
      timestamp: new Date(),
      actor: 'admin',
      note: `Admin resolved dispute with full refund of ₹${totalAmount} to customer. Notes: ${resolutionNotes}`
    });
  } else if (decision === 'split') {
    const providerShare = Math.round(totalAmount * (splitPercent / 100));
    const customerShare = totalAmount - providerShare;
    booking.escrow.status = 'released';
    booking.escrow.releasedAt = new Date();
    booking.status = 'COMPLETED';
    booking.statusHistory.push({
      status: 'COMPLETED',
      timestamp: new Date(),
      actor: 'admin',
      note: `Admin negotiated split: ₹${providerShare} released to provider, ₹${customerShare} refunded to customer. Notes: ${resolutionNotes}`
    });
  }

  await booking.save();
  return booking;
};
