import { z } from 'zod';

export const CreateDestinationSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(500),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  localClimate: z.string().max(100).optional(),
  timeZone: z.string().max(50).optional(),
});

export const UpdateDestinationSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  localClimate: z.string().max(100).optional(),
  timeZone: z.string().max(50).optional(),
});

export type CreateDestinationDTO = z.infer<typeof CreateDestinationSchema>;
export type UpdateDestinationDTO = z.infer<typeof UpdateDestinationSchema>;
