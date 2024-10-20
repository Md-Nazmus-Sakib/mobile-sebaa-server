import { Router } from 'express';
import { USER_ROLE } from '../Users/user.constant';
import auth from '../../middlewares/auth';
import { BookingValidationSchema } from './booking.validation';
import validateRequest from '../../middlewares/validateRequest';
import { BookingController } from './booking.controller';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(BookingValidationSchema.createBookingValidationSchema),
  BookingController.createBooking,
);
router.put(
  '/:id/return',
  auth(USER_ROLE.admin),
  BookingController.updateBookingInfo,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.user),
  BookingController.getBookingInfo,
);

export const BookingRoutes = router;
