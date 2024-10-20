import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TUser } from './user.interface';
import { User } from './user.model';
//================================================================================
const getUserDataFromDB = async (userEmail: string) => {
  const result = await User.findOne({ email: userEmail }).select('-password');

  return result;
};
//================================================================================

//================================================================================
const updateUserDataIntoDB = async (
  userEmail: string,
  payload: Partial<TUser>,
) => {
  // Check if the payload contains the role field
  if ('role' in payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Role cannot be changed');
  }
  if ('email' in payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email cannot be changed');
  }
  const result = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: payload },
    { new: true, runValidators: true },
  ).select('-password');

  return result;
};
//================================================================================

//================================================================================
const deleteUserDataIntoDB = async (userEmail: string) => {
  // Find the user by email
  const user = await User.findOne({ email: userEmail });

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with the email ${userEmail} does not exist.`,
    );
  }

  // Check if the user is blocked
  if (user.status === 'blocked') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `The user with the email ${userEmail} is blocked by Admin and cannot be deleted.`,
    );
  }

  // Set the 'isDeleted' field to true
  const payload = { isDeleted: true };

  const result = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: payload },
    { new: true, runValidators: true },
  ).select('-password');

  return result;
};
//================================================================================

//================================================================================
const toggleUserStatusIntoDB = async (email: string, status: string) => {
  // Find the user by email
  const user = await User.findOne({ email });

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with the email ${email} does not exist.`,
    );
  }

  // Set the 'isDeleted' field to true
  const payload = { status };

  const result = await User.findOneAndUpdate(
    { email },
    { $set: payload },
    { new: true, runValidators: true },
  ).select('-password');

  return result;
};
//================================================================================

//================================================================================
const getAllUserDataFromDB = async () => {
  const users = await User.find().select('-password');
  const totalUsers = await User.countDocuments(); // Get the total count

  return { users, totalUsers };
};
//================================================================================
export const UserServices = {
  getUserDataFromDB,
  updateUserDataIntoDB,
  deleteUserDataIntoDB,
  toggleUserStatusIntoDB,
  getAllUserDataFromDB,
};
