import { z } from 'zod';

const dateSchema = z
  .union([z.string(), z.date()])
  .transform((val) => (typeof val === 'string' ? new Date(val) : val));

export const CreateItinerarySchema = z.object({
  title: z.string(),
  startDate: dateSchema,
  endDate: dateSchema,
  itineraryStatus: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED']),
  foodBudget: z.number().optional(),
  lodgingBudget: z.number().optional(),
  totalBudget: z.number().optional(),
  usersIds: z.array(z.number()).optional(),
  activityIds: z.array(z.number()).optional(),
  destinationIds: z.array(z.number()).optional(),
  transportIds: z.array(z.number()).optional(),
  requiredDocumentIds: z.array(z.number()).optional(),
});
export const UpdateItinerarySchema = z.object({
  title: z.string().optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  itineraryStatus: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  foodBudget: z.number().optional(),
  lodgingBudget: z.number().optional(),
  totalBudget: z.number().optional(),
  usersIds: z.array(z.number()).optional(),
  activityIds: z.array(z.number()).optional(),
  destinationIds: z.array(z.number()).optional(),
  transportIds: z.array(z.number()).optional(),
  requiredDocumentIds: z.array(z.number()).optional(),
});

export type CreateItineraryDTO = z.infer<typeof CreateItinerarySchema>;
export type UpdateItineraryDTO = z.infer<typeof UpdateItinerarySchema>;
