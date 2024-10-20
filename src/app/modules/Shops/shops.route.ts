import { Router } from 'express';
import { ShopValidation } from './shops.validation';
import { ShopController } from './shops.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../Users/user.constant';

const router = Router();

router.post(
  '/create-shop',
  auth(USER_ROLE.Admin, USER_ROLE.Sp),
  validateRequest(ShopValidation.createShopValidationSchema),
  ShopController.createShop,
);
router.get(
  '/my-shop',
  auth(USER_ROLE.Admin, USER_ROLE.Sp),
  ShopController.getShopData,
);

router.put(
  '/my-shop/:id',
  auth(USER_ROLE.Admin, USER_ROLE.Sp),
  ShopController.updateShopData,
);
router.delete(
  '/my-shop/:id',
  auth(USER_ROLE.Admin, USER_ROLE.Sp),
  ShopController.deleteShopData,
);
router.put(
  '/status/:id',
  auth(USER_ROLE.Admin),
  ShopController.toggleShopStatus,
);

router.get('/', ShopController.allShopData);

export const ShopRoutes = router;
