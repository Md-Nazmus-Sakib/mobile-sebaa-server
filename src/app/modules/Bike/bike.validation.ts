import { z } from 'zod';

const createBikeValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: 'Bike Name is required' }),
    description: z
      .string()
      .trim()
      .min(1, { message: 'Bike Description is required' }),
    pricePerHour: z.number().nonnegative({ message: 'Bike Rate is required' }),
    isAvailable: z.boolean().optional().default(true),
    cc: z.number().nonnegative({ message: 'CC is required' }),
    year: z
      .number()
      .int()
      .nonnegative({ message: 'Manufacturing year is required' }),
    model: z.string().trim().min(1, { message: 'Bike Model is required' }),
    brand: z.string().trim().min(1, { message: 'Bike Brand is required' }),
  }),
});

const updateBikeValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Bike Name is required' })
      .optional(),
    description: z
      .string()
      .trim()
      .min(1, { message: 'Bike Description is required' })
      .optional(),
    pricePerHour: z
      .number()
      .nonnegative({ message: 'Bike Rate is required' })
      .optional(),
    isAvailable: z.boolean().optional().default(true).optional(),
    cc: z.number().nonnegative({ message: 'CC is required' }).optional(),
    year: z
      .number()
      .int()
      .nonnegative({ message: 'Manufacturing year is required' })
      .optional(),
    model: z
      .string()
      .trim()
      .min(1, { message: 'Bike Model is required' })
      .optional(),
    brand: z
      .string()
      .trim()
      .min(1, { message: 'Bike Brand is required' })
      .optional(),
  }),
});

export const BikeValidationSchema = {
  createBikeValidationSchema,
  updateBikeValidationSchema,
};
