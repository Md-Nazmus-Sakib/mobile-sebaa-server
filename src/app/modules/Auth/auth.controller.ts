/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponce';
import { AuthServices } from './auth.service';

//==========================================================

//Create User Controller
const createUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await AuthServices.createUserIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

//=========================================================

//==========================================================

//Login User Controller
const loginUser = catchAsync(async (req, res) => {
  const loginUserData = req.body;
  const result = await AuthServices.loginUser(loginUserData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is Logged in successfully',
    token: result.accessToken,
    data: result.responseUserData,
  });
});

//==============================================================

export const AuthController = {
  createUser,
  loginUser,
};
