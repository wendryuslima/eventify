import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  capacity: z.number().min(0, "Capacidade deve ser maior ou igual a 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const updateEventSchema = createEventSchema.partial();

export const eventParamsSchema = z.object({
  id: z.string(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventParams = z.infer<typeof eventParamsSchema>;
