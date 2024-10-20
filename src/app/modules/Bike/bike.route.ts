import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BikeValidationSchema } from './bike.validation';
import { BikeController } from './bike.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Users/user.constant';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(BikeValidationSchema.createBikeValidationSchema),
  BikeController.createBike,
);
router.get(
  '/',

  BikeController.getAllBike,
);

router.put(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(BikeValidationSchema.updateBikeValidationSchema),
  BikeController.updateBikeInfo,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin),

  BikeController.deleteBike,
);

export const BikeRoutes = router;
