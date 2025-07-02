import { z } from 'zod';

export const CreateTransportSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  valor: z.number().nonnegative('Valor deve ser positivo'),
  dataCsaida: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de saída inválida',
  }),
  dataChegada: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Data de chegada inválida',
  }),
  duracao: z.string().min(1, 'Duração é obrigatória'),
  descricao: z.string().optional(),
});

export const UpdateTransportSchema = CreateTransportSchema.partial();

export type CreateTransportDTO = z.infer<typeof CreateTransportSchema>;
export type UpdateTransportDTO = z.infer<typeof UpdateTransportSchema>;
