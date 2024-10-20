import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TBike } from './bike.interface';
import { Bike } from './bike.model';

const createBikeIntoDB = async (bikeData: TBike) => {
  const result = await Bike.create(bikeData);
  return result;
};
const getAllBikeFromDB = async () => {
  const result = await Bike.find({ isAvailable: true });
  return result;
};

const updateBikeInfoIntoDB = async (id: string, payload: Partial<TBike>) => {
  // Find the bike by its ID
  const bike = await Bike.findById(id);

  // Check if the bike is found
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  const result = await Bike.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};

const deleteBikeFromDB = async (bikeId: string) => {
  // Find the bike by its ID
  const bike = await Bike.findById(bikeId);

  // Check if the bike is found
  if (!bike) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  // Check if the bike is not available
  if (bike.isAvailable === false) {
    throw new AppError(httpStatus.NOT_FOUND, 'Bike is already unavailable');
  }
  const result = await Bike.findByIdAndUpdate(
    bikeId,
    { isAvailable: false },
    { new: true },
  );

  return result;
};

export const BikeServices = {
  createBikeIntoDB,
  getAllBikeFromDB,
  updateBikeInfoIntoDB,
  deleteBikeFromDB,
};
