import { Router, Request, Response } from "express";
import { prisma } from "../services/database";
import { AuditService } from "../services/audit";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            inscriptions: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const eventsWithCount = events.map((event) => {
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        status: event.status,
        capacity: event.capacity,
        totalInscriptions: event._count.inscriptions,
        remainingCapacity: event.capacity - event._count.inscriptions,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      };
    });

    res.json({
      success: true,
      data: eventsWithCount,
      total: eventsWithCount.length,
    });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível buscar os eventos",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: "ID inválido",
        message: "O ID deve ser um número válido",
      });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        inscriptions: true,
        _count: {
          select: {
            inscriptions: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({
        error: "Evento não encontrado",
        message: "Não existe evento com este ID",
      });
    }

    const eventData = {
      id: event.id,
      title: event.title,
      description: event.description,
      status: event.status,
      capacity: event.capacity,
      totalInscriptions: event._count.inscriptions,
      remainingCapacity: event.capacity - event._count.inscriptions,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      inscriptions: event.inscriptions,
    };

    res.json({
      success: true,
      data: eventData,
    });
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível buscar o evento",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, capacity, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Título obrigatório",
        message: "O título do evento é obrigatório",
      });
    }

    if (capacity === undefined || capacity === null) {
      return res.status(400).json({
        error: "Capacidade obrigatória",
        message: "A capacidade do evento é obrigatória",
      });
    }

    if (isNaN(capacity) || capacity < 0) {
      return res.status(400).json({
        error: "Capacidade inválida",
        message: "A capacidade deve ser um número maior ou igual a 0",
      });
    }

    const newEvent = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        capacity: parseInt(capacity),
        status: status || "ACTIVE",
      },
      include: {
        _count: {
          select: {
            inscriptions: true,
          },
        },
      },
    });

   
    await AuditService.logEventCreated(
      newEvent.id,
      {
        title: newEvent.title,
        capacity: newEvent.capacity,
        status: newEvent.status,
      },
      req.ip || "unknown"
    );

    res.status(201).json({
      success: true,
      message: "Evento criado com sucesso!",
      data: {
        id: newEvent.id,
        title: newEvent.title,
        description: newEvent.description,
        status: newEvent.status,
        capacity: newEvent.capacity,
        totalInscriptions: newEvent._count.inscriptions,
        remainingCapacity: newEvent.capacity - newEvent._count.inscriptions,
        createdAt: newEvent.createdAt.toISOString(),
        updatedAt: newEvent.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível criar o evento",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { title, description, capacity, status } = req.body;

    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: "ID inválido",
        message: "O ID deve ser um número válido",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: "Evento não encontrado",
        message: "Não existe evento com este ID",
      });
    }

    const updateData: {
      title?: string;
      description?: string | null;
      capacity?: number;
      status?: "ACTIVE" | "INACTIVE";
    } = {};

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({
          error: "Título inválido",
          message: "O título não pode ser vazio",
        });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    if (capacity !== undefined) {
      if (isNaN(capacity) || capacity < 0) {
        return res.status(400).json({
          error: "Capacidade inválida",
          message: "A capacidade deve ser um número maior ou igual a 0",
        });
      }
      updateData.capacity = parseInt(capacity);
    }

    if (status !== undefined) {
      if (status !== "ACTIVE" && status !== "INACTIVE") {
        return res.status(400).json({
          error: "Status inválido",
          message: "O status deve ser ACTIVE ou INACTIVE",
        });
      }
      updateData.status = status;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        _count: {
          select: {
            inscriptions: true,
          },
        },
      },
    });

   
    await AuditService.logEventUpdated(
      eventId,
      {
        title: existingEvent.title,
        capacity: existingEvent.capacity,
        status: existingEvent.status,
      },
      {
        title: updatedEvent.title,
        capacity: updatedEvent.capacity,
        status: updatedEvent.status,
      },
      req.ip || "unknown"
    );

    res.json({
      success: true,
      message: "Evento atualizado com sucesso!",
      data: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        status: updatedEvent.status,
        capacity: updatedEvent.capacity,
        totalInscriptions: updatedEvent._count.inscriptions,
        remainingCapacity:
          updatedEvent.capacity - updatedEvent._count.inscriptions,
        createdAt: updatedEvent.createdAt.toISOString(),
        updatedAt: updatedEvent.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível atualizar o evento",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: "ID inválido",
        message: "O ID deve ser um número válido",
      });
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({
        error: "Evento não encontrado",
        message: "Não existe evento com este ID",
      });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });


    await AuditService.logEventDeleted(
      eventId,
      {
        title: existingEvent.title,
        capacity: existingEvent.capacity,
        status: existingEvent.status,
      },
      req.ip || "unknown"
    );

    res.json({
      success: true,
      message: "Evento deletado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível deletar o evento",
    });
  }
});

export { router as eventRoutes };
