import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  releaseEscrow,
  disputeBooking
} from '../controllers/bookingController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', updateBookingStatus);
router.post('/:id/release-escrow', releaseEscrow);
router.post('/:id/dispute', disputeBooking);

export default router;
