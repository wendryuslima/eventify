import { Router, Request, Response, NextFunction } from "express";
import { eventService } from "../services/event.service";
import {
  createInscriptionSchema,
  cancelInscriptionSchema,
  inscriptionParamsSchema,
  CreateInscriptionInput,
  CancelInscriptionInput,
} from "../schemas/inscription";
import { z, ZodSchema } from "zod";

const router = Router();

const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Dados inválidos",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};

export interface RequestWithValidatedParams<T> extends Request {
  validatedParams?: T;
}

export const validateParams = <T>(schema: ZodSchema<T>) => {
  return (
    req: RequestWithValidatedParams<T>,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      req.validatedParams = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: "Validation Error",
          message: "Parâmetros inválidos",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};

const getEventId = (req: Request, res: Response): number | null => {
  const idParam = req.params.id;
  if (!idParam) {
    res
      .status(400)
      .json({ error: "Bad Request", message: "ID do evento é obrigatório" });
    return null;
  }
  const eventId = parseInt(idParam, 10);
  if (isNaN(eventId) || eventId <= 0) {
    res
      .status(400)
      .json({ error: "Bad Request", message: "ID do evento inválido" });
    return null;
  }
  return eventId;
};

router.post(
  "/:id/inscriptions",
  validateParams(inscriptionParamsSchema),
  validateBody(createInscriptionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = getEventId(req, res);
      if (eventId === null) return;

      const inscription = await eventService.createInscription(
        eventId,
        req.body as CreateInscriptionInput
      );

      res.status(201).json({
        success: true,
        message: "Inscrição realizada com sucesso!",
        data: {
          id: inscription.id,
          name: inscription.name,
          phone: inscription.phone,
          eventId: inscription.eventId,
          eventTitle: inscription.event.title,
          createdAt: inscription.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;

        if (message === "Evento não encontrado") {
          return res.status(404).json({ error: "Not Found", message });
        }
        if (message === "Evento não está ativo para inscrições") {
          return res.status(400).json({ error: "Bad Request", message });
        }
        if (
          message === "Evento esgotado - não há mais vagas disponíveis" ||
          message === "Você já está inscrito neste evento"
        ) {
          return res.status(409).json({ error: "Conflict", message });
        }
      }
      next(error);
    }
  }
);

router.delete(
  "/:id/inscriptions",
  validateParams(inscriptionParamsSchema),
  validateBody(cancelInscriptionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = getEventId(req, res);
      if (eventId === null) return;

      const { phone } = req.body as CancelInscriptionInput;
      const result = await eventService.cancelInscription(eventId, phone);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Inscrição não encontrada"
      ) {
        return res
          .status(404)
          .json({ error: "Not Found", message: error.message });
      }
      next(error);
    }
  }
);

router.get(
  "/:id/inscriptions",
  validateParams(inscriptionParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = getEventId(req, res);
      if (eventId === null) return;

      const result = await eventService.getEventInscriptions(eventId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Evento não encontrado") {
        return res
          .status(404)
          .json({ error: "Not Found", message: error.message });
      }
      next(error);
    }
  }
);

export { router as inscriptionRoutes };
