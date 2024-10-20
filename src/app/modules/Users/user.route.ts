import { Router } from 'express';
import { UserController } from './user.controller';
import { USER_ROLE } from './user.constant';
import auth from '../../middlewares/auth';

const router = Router();

router.get(
  '/me',
  auth(USER_ROLE.Admin, USER_ROLE.User, USER_ROLE.Sp),
  UserController.getUserData,
);

router.put(
  '/me',
  auth(USER_ROLE.Admin, USER_ROLE.User, USER_ROLE.Sp),
  UserController.updateUserData,
);
router.delete(
  '/me',
  auth(USER_ROLE.Admin, USER_ROLE.User, USER_ROLE.Sp),
  UserController.deleteUserData,
);
router.put('/status', auth(USER_ROLE.Admin), UserController.toggleUserStatus);
router.get('/', auth(USER_ROLE.Admin), UserController.allUserData);

export const UserRoutes = router;
