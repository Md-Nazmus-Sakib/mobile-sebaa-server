import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppErrors';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/Users/user.interface';
import { User } from '../modules/Users/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    // checking if the token is missing
    if (!authHeader) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Authorization header missing',
      );
    }

    // const [prefix, token] = authHeader.split(' ');

    // if (prefix !== 'Bearer' || !token) {
    //   throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token format');
    // }

    // checking if the given token is valid
    const decoded = jwt.verify(
      authHeader,
      config.jwt_access_token as string,
    ) as JwtPayload;

    if (!decoded) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route.',
      );
    }

    const { userEmail, role } = decoded;

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !!!');
    }
    const existUser = await User.findOne({ email: userEmail });
    if (!existUser) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route.',
      );
    }

    if (existUser.role !== role) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route.',
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
