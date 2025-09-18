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
      createdAt: event.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: event.updatedAt?.toISOString() || new Date().toISOString(),
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
      createdAt: event.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: event.updatedAt?.toISOString() || new Date().toISOString(),
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

// Criar evento
router.post("/", async (req, res, next) => {
  try {
    const { title, description, capacity, status } = req.body;

    // Validação simples
    if (!title || title.trim() === "") {
      res.status(400).json({
        error: "Validation Error",
        message: "Título é obrigatório",
      });
      return;
    }

    if (capacity === undefined || capacity < 0) {
      res.status(400).json({
        error: "Validation Error",
        message: "Capacidade deve ser maior ou igual a 0",
      });
      return;
    }

    const eventData = {
      title: title.trim(),
      description: description?.trim() || null,
      capacity: parseInt(capacity),
      status: status || "ACTIVE",
    };

    const event = await eventService.createEvent(eventData);

    res.status(201).json({
      success: true,
      message: "Evento criado com sucesso!",
      data: event,
    });
  } catch (error) {
    next(error);
  }
});

// Editar evento
router.patch("/:id", validateId, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id || "0");
    const { title, description, capacity, status } = req.body;

    // Validação simples
    if (title !== undefined && (!title || title.trim() === "")) {
      res.status(400).json({
        error: "Validation Error",
        message: "Título não pode ser vazio",
      });
      return;
    }

    if (capacity !== undefined && capacity < 0) {
      res.status(400).json({
        error: "Validation Error",
        message: "Capacidade deve ser maior ou igual a 0",
      });
      return;
    }

    const updateData: {
      title?: string;
      description?: string;
      capacity?: number;
      status?: "ACTIVE" | "INACTIVE";
    } = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined)
      updateData.description = description?.trim() || undefined;
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (status !== undefined)
      updateData.status = status as "ACTIVE" | "INACTIVE";

    const event = await eventService.updateEvent(id, updateData);

    res.json({
      success: true,
      message: "Evento atualizado com sucesso!",
      data: event,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Evento não encontrado") {
      res.status(404).json({
        error: "Not Found",
        message: error.message,
      });
      return;
    }
    next(error);
  }
});

// Deletar evento
router.delete("/:id", validateId, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id || "0");

    await eventService.deleteEvent(id);

    res.json({
      success: true,
      message: "Evento deletado com sucesso!",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Evento não encontrado") {
      res.status(404).json({
        error: "Not Found",
        message: error.message,
      });
      return;
    }
    next(error);
  }
});

export { router as eventRoutes };
