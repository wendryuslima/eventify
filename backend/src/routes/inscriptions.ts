import { Router, Request, Response, NextFunction } from "express";
import { eventService } from "../services/event.service";

const router = Router();

// Validação simples
const validateBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone } = req.body;

    if (!name || name.trim() === "") {
      res.status(400).json({
        error: "Validation Error",
        message: "Nome é obrigatório",
      });
      return;
    }

    if (!phone || phone.trim() === "") {
      res.status(400).json({
        error: "Validation Error",
        message: "Telefone é obrigatório",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
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
  validateBody,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = getEventId(req, res);
      if (eventId === null) return;

      const inscription = await eventService.createInscription(
        eventId,
        req.body
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
          res.status(404).json({ error: "Not Found", message });
          return;
        }
        if (message === "Evento não está ativo para inscrições") {
          res.status(400).json({ error: "Bad Request", message });
          return;
        }
        if (
          message === "Evento esgotado - não há mais vagas disponíveis" ||
          message === "Você já está inscrito neste evento"
        ) {
          res.status(409).json({ error: "Conflict", message });
          return;
        }
      }
      next(error);
    }
  }
);

router.delete(
  "/:id/inscriptions",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = getEventId(req, res);
      if (eventId === null) return;

      const { phone } = req.body;
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
        res.status(404).json({ error: "Not Found", message: error.message });
        return;
      }
      next(error);
    }
  }
);

router.get(
  "/:id/inscriptions",
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
        res.status(404).json({ error: "Not Found", message: error.message });
        return;
      }
      next(error);
    }
  }
);

// Editar inscrição
router.patch("/:id/inscriptions/:inscriptionId", async (req, res, next) => {
  try {
    const eventId = getEventId(req, res);
    if (eventId === null) return;

    const inscriptionId = parseInt(req.params.inscriptionId || "0");
    if (isNaN(inscriptionId) || inscriptionId <= 0) {
      res.status(400).json({
        error: "Validation Error",
        message: "ID da inscrição inválido",
      });
      return;
    }

    const { name, phone } = req.body;

    // Validação simples
    if (name !== undefined && (!name || name.trim() === "")) {
      res.status(400).json({
        error: "Validation Error",
        message: "Nome não pode ser vazio",
      });
      return;
    }

    if (phone !== undefined && (!phone || phone.trim() === "")) {
      res.status(400).json({
        error: "Validation Error",
        message: "Telefone não pode ser vazio",
      });
      return;
    }

    const updateData: {
      name?: string;
      phone?: string;
    } = {};
    if (name !== undefined) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone.trim();

    const inscription = await eventService.updateInscription(
      eventId,
      inscriptionId,
      updateData
    );

    res.json({
      success: true,
      message: "Inscrição atualizada com sucesso!",
      data: inscription,
    });
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message;

      if (
        message === "Evento não encontrado" ||
        message === "Inscrição não encontrada"
      ) {
        res.status(404).json({
          error: "Not Found",
          message,
        });
        return;
      }

      if (message === "Telefone já está em uso neste evento") {
        res.status(409).json({
          error: "Conflict",
          message,
        });
        return;
      }
    }
    next(error);
  }
});

export { router as inscriptionRoutes };
