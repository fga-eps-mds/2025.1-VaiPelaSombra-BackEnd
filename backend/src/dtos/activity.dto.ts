import { z } from 'zod';

const dateSchema = z
  .union([z.string(), z.date()])
  .transform((val) => (typeof val === 'string' ? new Date(val) : val));

export const CreateActivitySchema = z.object({
  location: z.string(),
  title: z.string(),
  price: z.number(),
  startTime: dateSchema,
  endTime: dateSchema,
  duration: z.string().optional(),
  description: z.string().optional(),
  itineraryId: z.number(),
  destination: z.number(),
});

export const UpdateActivitySchema = z.object({
  location: z.string().optional(),
  title: z.string().optional(),
  price: z.number().optional(),
  startTime: dateSchema.optional(),
  endTime: dateSchema.optional(),
  duration: z.string().optional(),
  description: z.string().optional(),
  destination: z.number().optional(),
});

export type CreateActivityDTO = z.infer<typeof CreateActivitySchema>;
export type UpdateActivityDTO = z.infer<typeof UpdateActivitySchema>;
