import { z } from 'zod';

export const CreateTransportSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  cost: z.number().nonnegative('Valor deve ser positivo'),
  itineraryId: z.number(),
  departure: z.union([z.string(), z.date()]).optional(),
  arrival: z.union([z.string(), z.date()]).optional(),
  duration: z.union([z.string(), z.date()]).optional(),
  description: z.string().optional(),
});

export const UpdateTransportSchema = CreateTransportSchema.partial();

export type CreateTransportDTO = z.infer<typeof CreateTransportSchema>;
export type UpdateTransportDTO = z.infer<typeof UpdateTransportSchema>;
