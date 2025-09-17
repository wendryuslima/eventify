import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .nullable()
    .optional(),
  capacity: z.number()
    .int('Capacidade deve ser um número inteiro')
    .min(0, 'Capacidade deve ser maior ou igual a 0'),
  status: z.enum(['ACTIVE', 'INACTIVE'])
    .default('ACTIVE')
});

export const updateEventSchema = createEventSchema.partial();

export const eventParamsSchema = z.object({
  id: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error('ID deve ser um número positivo');
    }
    return num;
  })
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventParams = z.infer<typeof eventParamsSchema>;
