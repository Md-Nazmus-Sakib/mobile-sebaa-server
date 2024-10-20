import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponce';
import { BikeServices } from './bike.service';

//Create Bike Controller
const createBike = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await BikeServices.createBikeIntoDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike added successfully',
    data: result,
  });
});
const getAllBike = catchAsync(async (req, res) => {
  const result = await BikeServices.getAllBikeFromDB();
  if (result.length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: result,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikes retrieved successfully',
    data: result,
  });
});

const updateBikeInfo = catchAsync(async (req, res) => {
  const updateData = req.body;
  const { id } = req.params;
  const result = await BikeServices.updateBikeInfoIntoDB(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike updated successfully',
    data: result,
  });
});

const deleteBike = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BikeServices.deleteBikeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bike deleted successfully',
    data: result,
  });
});

export const BikeController = {
  createBike,
  getAllBike,
  updateBikeInfo,
  deleteBike,
};
