import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponce';
import { UserServices } from './user.service';

//========================================================================

const getUserData = catchAsync(async (req, res) => {
  const userEmail = req.user.userEmail;
  const result = await UserServices.getUserDataFromDB(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});
//========================================================================

//========================================================================
const updateUserData = catchAsync(async (req, res) => {
  const updateData = req.body;
  const userEmail = req.user.userEmail;
  const result = await UserServices.updateUserDataIntoDB(userEmail, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});
//========================================================================

//========================================================================
const deleteUserData = catchAsync(async (req, res) => {
  const userEmail = req.user.userEmail;
  const result = await UserServices.deleteUserDataIntoDB(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  });
});
//========================================================================

//========================================================================
const toggleUserStatus = catchAsync(async (req, res) => {
  const { email, status } = req.body;
  const result = await UserServices.toggleUserStatusIntoDB(email, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User status successfully updated to ${status}.`,
    data: result,
  });
});
//========================================================================

//========================================================================
const allUserData = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserDataFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All User profile retrieved successfully',
    data: result,
  });
});
//========================================================================
export const UserController = {
  getUserData,
  updateUserData,
  deleteUserData,
  toggleUserStatus,
  allUserData,
};
