import { z } from 'zod';

export const CreateActivitySchema = z.object({
  location: z.string(),
  title: z.string(),
  price: z.number(),
  startTime: z.union([z.string(), z.date()]),
  endTime: z.union([z.string(), z.date()]),
  duration: z.union([z.string(), z.date()]),
  description: z.string().optional(),
  itineraryId: z.number(),
});

export const UpdateActivitySchema = z.object({
  location: z.string().optional(),
  title: z.string().optional(),
  price: z.number().optional(),
  startTime: z.union([z.string(), z.date()]).optional(),
  endTime: z.union([z.string(), z.date()]).optional(),
  duration: z.union([z.string(), z.date()]).optional(),
  description: z.string().optional(),
  itineraryId: z.number().optional(),
});

export type CreateActivityDTO = z.infer<typeof CreateActivitySchema>;
export type UpdateActivityDTO = z.infer<typeof UpdateActivitySchema>;
