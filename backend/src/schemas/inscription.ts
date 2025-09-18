import { z } from "zod";

export const createInscriptionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
});

export const cancelInscriptionSchema = z.object({
  phone: z.string().min(1, "Telefone é obrigatório"),
});

export const inscriptionParamsSchema = z.object({
  id: z.string(),
});

export type CreateInscriptionInput = z.infer<typeof createInscriptionSchema>;
export type CancelInscriptionInput = z.infer<typeof cancelInscriptionSchema>;
export type InscriptionParams = z.infer<typeof inscriptionParamsSchema>;
