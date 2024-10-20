import { model, Schema } from 'mongoose';
import { ServiceCategory, TShop } from './shops.interface';

const shopSchema = new Schema<TShop>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerName: { type: String, required: true },
    shopName: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, required: false }, // Optional notes
    mobile: { type: String, required: true },
    alterMobile: { type: String, required: false }, // Optional alternate contact
    shopLocation: {
      lat: { type: Number, required: true },
      long: { type: Number, required: true },
    },
    selectedDivision: { type: String, required: true },
    selectedDistrict: { type: String, required: true },
    selectedTown: { type: String, required: true },
    serviceCategory: {
      type: [String],
      enum: Object.values(ServiceCategory), // Enum for service categories
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Approve', 'Pending', 'Rejected'], // Enum-like status field
      default: 'Pending',
    },
    addDate: { type: Date, required: true, default: Date.now }, // Timestamp for shop creation
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);
// Create and export the Shop model
export const Shop = model<TShop>('Shop', shopSchema);

export default Shop;
