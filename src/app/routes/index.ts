import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/Users/user.route';

import { BookingRoutes } from '../modules/Bookings/booking.route';
import { ShopRoutes } from '../modules/Shops/shops.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/shop',
    route: ShopRoutes,
  },
  {
    path: '/rentals',
    route: BookingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
