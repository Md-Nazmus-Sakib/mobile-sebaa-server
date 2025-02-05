import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/Users/user.route';

import { ShopRoutes } from '../modules/Shops/shops.route';
import { CountryRoute } from '../modules/Country/country.route';

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
    path: '/country',
    route: CountryRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
