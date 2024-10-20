import { Schema, model } from 'mongoose';
import { TBike } from './bike.interface';

const bikeSchema = new Schema<TBike>(
  {
    name: {
      type: String,
      required: [true, 'Bike Name is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Bike Description is required'],
      trim: true,
    },

    pricePerHour: {
      type: Number,
      required: [true, 'Bike Rate is required'],
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    cc: {
      type: Number,
      required: [true, 'CC is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Bike Model is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Bike Brand is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Bike = model<TBike>('Bike', bikeSchema);
