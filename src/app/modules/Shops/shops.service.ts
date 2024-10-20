import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TShop } from './shops.interface';
import Shop from './shops.model';
import { User } from '../Users/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { shopSearchableFields } from './shops.constant';

const createShopIntoDB = async (email: string, shopData: TShop) => {
  // Find the user by email
  const user = await User.findOne({ email });

  // If the user doesn't exist, throw an error
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with the email ${email} does not exist.`,
    );
  }

  // Set the 'createdBy' field to the user's ID
  shopData.createdBy = user._id;

  // Check if a shop with the given mobile number already exists
  const existingShop = await Shop.findOne({ mobile: shopData.mobile });

  if (!existingShop) {
    // Create a new shop if no shop with the same mobile exists
    const newShop = await Shop.create(shopData);
    return newShop;
  }

  // If the existing shop is not approved, throw a forbidden error
  if (existingShop.status !== 'Approve') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `The shop status is ${existingShop.status}.`,
    );
  }

  // If the existing shop is marked as deleted, reactivate it and update its data
  if (existingShop.isDeleted) {
    const updatedShop = await Shop.findOneAndUpdate(
      { mobile: existingShop.mobile },
      { $set: { ...shopData, isDeleted: false } },
      { new: true, runValidators: true },
    );
    return updatedShop;
  }

  // If the shop exists and is neither blocked nor deleted, throw a conflict error
  throw new AppError(
    httpStatus.CONFLICT,
    `A shop with the mobile number ${shopData.mobile} already exists.`,
  );
};

//================================================================================
const getShopDataFromDB = async (userEmail: string) => {
  // Find the user by email
  const createShopUser = await User.findOne({ email: userEmail });

  if (!createShopUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with email ${userEmail} not found.`,
    );
  }

  // Find the shop using the user's ObjectId
  const result = await Shop.findOne({ createdBy: createShopUser._id });

  return result;
};
//================================================================================

//================================================================================
const updateShopDataIntoDB = async (id: string, payload: Partial<TShop>) => {
  // Check if the payload contains the role field
  if ('mobile' in payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Mobile cannot be changed');
  }
  if ('status' in payload) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Status cannot be changed');
  }
  // Find the shop by ID
  const existingShop = await Shop.findOne({ _id: id });

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, `Shop with ID ${id} not found.`);
  }
  const result = await Shop.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};
//================================================================================

//================================================================================
const deleteShopDataIntoDB = async (id: string) => {
  // Find the shop by ID
  const existingShop = await Shop.findOne({ _id: id });

  if (!existingShop) {
    throw new AppError(httpStatus.NOT_FOUND, `Shop with ID ${id} not found.`);
  }

  if (existingShop.isDeleted) {
    throw new AppError(httpStatus.GONE, `Shop with ID ${id} has been deleted.`);
  }
  // Set the 'isDeleted' field to true
  const payload = { isDeleted: true };

  const result = await Shop.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};
//================================================================================

//================================================================================
const toggleShopStatusIntoDB = async (id: string, status: string) => {
  // Find the user by email
  const existShop = await Shop.findOne({ _id: id });

  // If the user doesn't exist, throw an error
  if (!existShop) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This Shop With The ID ${id} does not exist.`,
    );
  }

  // Set the 'isDeleted' field to true
  const payload = { status };

  const result = await Shop.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true },
  );

  return result;
};
//================================================================================

//================================================================================
const getAllShopDataFromDB = async (query: Record<string, unknown>) => {
  // Create an instance of QueryBuilder to build the query
  const shopQuery = new QueryBuilder(
    Shop.find({ isDeleted: { $ne: true } }),
    query,
  )
    .search(shopSearchableFields)
    .filter();

  // Perform the count query before pagination
  const totalShop = await shopQuery.modelQuery.clone().countDocuments();

  // Apply sorting and pagination
  shopQuery.sort().paginate();

  // Execute the final query with sorting and pagination
  const result = await shopQuery.modelQuery.exec(); // Use exec() to execute query

  // Return the shop data along with the total count
  return { shop: result, totalShop };
};
//================================================================================

export const ShopServices = {
  createShopIntoDB,
  getShopDataFromDB,
  updateShopDataIntoDB,
  deleteShopDataIntoDB,
  toggleShopStatusIntoDB,
  getAllShopDataFromDB,
};
