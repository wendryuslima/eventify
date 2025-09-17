import { z } from "zod";

const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

export const createInscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      phoneRegex,
      "Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
    ),
});

export const cancelInscriptionSchema = z.object({
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      phoneRegex,
      "Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX"
    ),
});

export const inscriptionParamsSchema = z.object({
  id: z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error("ID deve ser um número positivo");
    }
    return num;
  }),
});

export type CreateInscriptionInput = z.infer<typeof createInscriptionSchema>;
export type CancelInscriptionInput = z.infer<typeof cancelInscriptionSchema>;
export type InscriptionParams = z.infer<typeof inscriptionParamsSchema>;
