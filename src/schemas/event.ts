import { z } from "zod";

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter pelo menos 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  capacity: z
    .string()
    .min(1, "Capacidade é obrigatória")
    .refine(
      (val) => !isNaN(Number(val)),
      "Capacidade deve ser um número válido"
    )
    .refine((val) => Number(val) >= 0, "Capacidade deve ser maior ou igual a 0")
    .refine(
      (val) => Number(val) <= 10000,
      "Capacidade deve ser menor ou igual a 10.000"
    ),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
