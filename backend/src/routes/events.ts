import { Router, Request, Response, NextFunction } from "express";
import { eventService } from "../services/event.service";
import { eventParamsSchema, EventParams } from "../schemas/event";
import { z } from "zod";

interface RequestWithValidatedParams extends Request {
  validatedParams?: EventParams;
}

const router = Router();

// Middleware de validação para parâmetros
const validateParams = (schema: z.ZodSchema) => {
  return (
    req: RequestWithValidatedParams,
    res: Response,
    next: NextFunction
  ) => {
    try {
      req.validatedParams = schema.parse(req.params) as EventParams;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Parâmetros inválidos",
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

router.get("/", async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      capacity: event.capacity,
      totalInscriptions: event._count?.inscriptions || 0,
      remainingCapacity: event.capacity - (event._count?.inscriptions || 0),
    }));

    res.json({
      success: true,
      data: formattedEvents,
      total: formattedEvents.length,
    });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validateParams(eventParamsSchema),
  async (req: RequestWithValidatedParams, res, next) => {
    try {
      const { id } = req.validatedParams!;
      const event = await eventService.getEventById(id);

      if (!event) {
        return res.status(404).json({
          error: "Not Found",
          message: "Evento não encontrado",
        });
      }

      const formattedEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        status: event.status,
        capacity: event.capacity,
        totalInscriptions: event._count?.inscriptions || 0,
        remainingCapacity: event.capacity - (event._count?.inscriptions || 0),
        inscriptions: event.inscriptions || [],
      };

      res.json({
        success: true,
        data: formattedEvent,
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as eventRoutes };
