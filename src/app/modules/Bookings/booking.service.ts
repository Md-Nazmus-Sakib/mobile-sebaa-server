/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { User } from '../Users/user.model';
import { TBooking } from './booking.interface';
import { Bike } from '../Bike/bike.model';
import mongoose from 'mongoose';
import { Booking } from './booking.model';

const createBookingIntoDB = async (
  userEmail: string,
  userRole: string,
  payload: Partial<TBooking>,
) => {
  const bookingData: Partial<TBooking> = {};

  //checking if the user is admin
  if (userRole === 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Admin Cannot Rentals.');
  }
  //   checking if the user is valid
  const user = await User.findOne({ email: userEmail });
  //User is not found then throw error
  if (!user) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid User');
  }
  //set the userId
  bookingData.userId = user._id;

  // Find the bike by its ID
  const bike = await Bike.findById(payload?.bikeId);

  // Check if the bike is found
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  // Check if the bike is not available
  if (bike.isAvailable === false) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike is already unavailable');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // change bike available Status (transaction-1)
    const bikeBooking = await Bike.findByIdAndUpdate(
      bike._id,
      { isAvailable: false },
      { new: true, session },
    );

    if (!bikeBooking) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Booking');
    }
    // create a Booking (transaction-2)
    bookingData.bikeId = bike._id;
    bookingData.startTime = payload?.startTime;
    const booking = await Booking.create([bookingData], { session });

    if (!booking.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Booking');
    }

    await session.commitTransaction();
    await session.endSession();
    return booking;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateBookingInfoIntoDB = async (id: string) => {
  // Find the bike by its ID
  const rental = await Booking.findById(id);

  // Check if the bike is found
  if (!rental) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike Booking not found');
  }

  // Check if the bike is not available
  if (rental.isReturned === true) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Bike is already returned');
  }
  const bike = await Bike.findById(rental.bikeId);
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  const startTime = new Date(rental.startTime);
  const returnTime = new Date();
  // Ensure returnTime is greater than startTime
  if (returnTime <= startTime) {
    throw new AppError(
      httpStatus.NOT_ACCEPTABLE,
      'Return time must be greater than start time',
    );
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const pricePerHour = bike?.pricePerHour as number;
    // Calculate the total cost based on rental duration

    const durationInHours = Math.ceil(
      (returnTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
    );
    const totalCost = durationInHours * pricePerHour;

    // Update the rental with return time, total cost, and isReturned status
    rental.returnTime = returnTime;
    rental.totalCost = totalCost;
    rental.isReturned = true;
    await rental.save({ session });

    // Update the bike's availability status
    bike.isAvailable = true;
    await bike.save({ session });

    await session.commitTransaction();
    session.endSession();
    return rental;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getBookingInfoIntoDB = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Find the booking information by the user's ID
  const bookingInfo = await Booking.find({ userId: user._id });
  return bookingInfo;
};

export const BookingServices = {
  createBookingIntoDB,
  updateBookingInfoIntoDB,
  getBookingInfoIntoDB,
};
