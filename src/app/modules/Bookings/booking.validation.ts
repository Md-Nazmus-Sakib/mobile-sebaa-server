import { z } from 'zod';

const createBookingValidationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    bikeId: z.string(),
    startTime: z.string(),
    returnTime: z.date().nullable().optional(),
    totalCost: z.number().optional(),
    isReturned: z.boolean().optional(),
  }),
});

export const BookingValidationSchema = {
  createBookingValidationSchema,
};
