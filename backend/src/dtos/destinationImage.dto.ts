import { z } from 'zod';

export const destinationImageSchema = z.object({
  filename: z.string(),
  mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  size: z.number().max(5 * 1024 * 1024, { message: 'File must be at most 5MB' }),
});
export type DestinationImageDTO = z.infer<typeof destinationImageSchema>;
