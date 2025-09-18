import { Router, Request, Response, NextFunction } from "express";
import { eventService } from "../services/event.service";

const router = Router();

const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id || "0");
  if (isNaN(id) || id <= 0) {
    res.status(400).json({
      error: "Validation Error",
      message: "ID inválido",
    });
    return;
  }
  next();
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

router.get("/:id", validateId, async (req: Request, res, next) => {
  try {
    const id = parseInt(req.params.id || "0");
    const event = await eventService.getEventById(id);

    if (!event) {
      res.status(404).json({
        error: "Not Found",
        message: "Evento não encontrado",
      });
      return;
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
});

export { router as eventRoutes };
