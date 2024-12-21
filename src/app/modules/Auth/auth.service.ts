/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config from '../../config';
import { TUser } from '../Users/user.interface';
import { User } from '../Users/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import { createToken, generateRandomCode } from './auth.utils';
import AppError from '../../errors/AppErrors';
import httpStatus from 'http-status';
import { VerificationCode } from './auth.model';
import { transporter } from '../../utils/email';

const createUserIntoDB = async (userData: TUser) => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    const newUser = await User.create(userData);

    const code = generateRandomCode();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await VerificationCode.create({ userId: newUser._id, code, expiresAt });

    await transporter.sendMail({
      from: config.email_user,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Your verification code is: <b>${code}</b></p><p>This code will expire in 2 minutes.</p>`,
    });

    const { password, ...userWithoutPassword } = newUser.toObject();
    return {
      ...userWithoutPassword,
    };
  }

  if (existingUser.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked by admin.');
  }

  if (!existingUser.isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not verified.');
  }

  if (existingUser.isDeleted) {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { ...userData, isDeleted: false } },
      { new: true, runValidators: true },
    ).select('-password');
    return updatedUser;
  }

  throw new AppError(httpStatus.FORBIDDEN, 'User already exists.');
};

const verifyUserData = async (verifiedCodeData: {
  email: string;
  code: string;
}) => {
  const { email, code } = verifiedCodeData;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already verified.');
  }

  const record = await VerificationCode.findOne({ userId: user._id, code });

  if (!record) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid verification code.');
  }

  if (record.expiresAt < new Date()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Verification code has expired.',
    );
  }

  user.isVerified = true;
  await user.save();
  await VerificationCode.deleteOne({ _id: record._id });

  return {
    message: 'User verified successfully.',
    user: { email: user.email, name: user.name, isVerified: user.isVerified },
  };
};

// Log in User

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  // Check if user exists and validate password
  if (
    !user ||
    !payload.password ||
    !(await bcrypt.compare(payload.password, user.password))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Incorrect email or password.');
  }

  // Additional checks for status, isDeleted, and isVerified
  if (user.isDeleted || !user.isVerified) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Account is not active. Please contact support.',
    );
  }

  // Generate token
  const token = createToken(
    { userEmail: user.email, role: user.role },
    config.jwt_access_token!,
    config.jwt_refresh_expires_in!,
  );

  return { token, user: { email: user.email, name: user.name } };
};

//Verification Code Resend

const verificationCodeResend = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  if (user.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already verified.');
  }

  const code = generateRandomCode();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await VerificationCode.findOneAndUpdate(
    { userId: user._id },
    { code, expiresAt },
    { upsert: true, new: true },
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Resend Verification Code',
    html: `<p>Your new verification code is: <b>${code}</b></p><p>This code will expire in 2 minutes.</p>`,
  });

  return { message: 'Verification code resent successfully.' };
};

export const AuthServices = {
  createUserIntoDB,
  loginUser,
  verifyUserData,
  verificationCodeResend,
};
