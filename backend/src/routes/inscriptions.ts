import { Router, Request, Response } from "express";
import { prisma } from "../services/database";

const router = Router();

router.post("/:id/inscriptions", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { name, phone } = req.body;

    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: "ID inválido",
        message: "O ID do evento deve ser um número válido",
      });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({
        error: "Nome obrigatório",
        message: "O nome é obrigatório",
      });
    }

    if (!phone || phone.trim() === "") {
      return res.status(400).json({
        error: "Telefone obrigatório",
        message: "O telefone é obrigatório",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
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

    if (event.status !== "ACTIVE") {
      return res.status(400).json({
        error: "Evento inativo",
        message: "Este evento não está ativo para inscrições",
      });
    }

    if (event._count.inscriptions >= event.capacity) {
      return res.status(409).json({
        error: "Evento esgotado",
        message: "Não há mais vagas disponíveis para este evento",
      });
    }

    const existingInscription = await prisma.inscription.findFirst({
      where: {
        eventId: eventId,
        phone: phone.trim(),
      },
    });

    if (existingInscription) {
      return res.status(409).json({
        error: "Inscrição duplicada",
        message: "Você já está inscrito neste evento",
      });
    }

    const newInscription = await prisma.inscription.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        eventId: eventId,
      },
      include: {
        event: {
          select: {
            title: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Inscrição realizada com sucesso!",
      data: {
        id: newInscription.id,
        name: newInscription.name,
        phone: newInscription.phone,
        eventId: newInscription.eventId,
        eventTitle: newInscription.event.title,
        createdAt: newInscription.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao criar inscrição:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível realizar a inscrição",
    });
  }
});

router.delete("/:id/inscriptions", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { phone } = req.body;

    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: "ID inválido",
        message: "O ID do evento deve ser um número válido",
      });
    }

    if (!phone || phone.trim() === "") {
      return res.status(400).json({
        error: "Telefone obrigatório",
        message: "O telefone é obrigatório para cancelar a inscrição",
      });
    }

    const inscription = await prisma.inscription.findFirst({
      where: {
        eventId: eventId,
        phone: phone.trim(),
      },
    });

    if (!inscription) {
      return res.status(404).json({
        error: "Inscrição não encontrada",
        message:
          "Não foi encontrada inscrição com este telefone para este evento",
      });
    }

    await prisma.inscription.delete({
      where: {
        id: inscription.id,
      },
    });

    res.json({
      success: true,
      message: "Inscrição cancelada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível cancelar a inscrição",
    });
  }
});

router.get("/:id/inscriptions", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: "ID inválido",
        message: "O ID do evento deve ser um número válido",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        inscriptions: {
          orderBy: {
            createdAt: "desc",
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

    const result = {
      event: {
        id: event.id,
        title: event.title,
        capacity: event.capacity,
        status: event.status,
      },
      inscriptions: event.inscriptions,
      total: event.inscriptions.length,
      remaining: event.capacity - event.inscriptions.length,
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erro ao buscar inscrições:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível buscar as inscrições",
    });
  }
});

router.patch("/:id/inscriptions/:inscriptionId", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const inscriptionId = parseInt(req.params.inscriptionId);
    const { name, phone } = req.body;

    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({
        error: "ID do evento inválido",
        message: "O ID do evento deve ser um número válido",
      });
    }

    if (isNaN(inscriptionId) || inscriptionId <= 0) {
      return res.status(400).json({
        error: "ID da inscrição inválido",
        message: "O ID da inscrição deve ser um número válido",
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({
        error: "Evento não encontrado",
        message: "Não existe evento com este ID",
      });
    }

    const existingInscription = await prisma.inscription.findFirst({
      where: {
        id: inscriptionId,
        eventId: eventId,
      },
    });

    if (!existingInscription) {
      return res.status(404).json({
        error: "Inscrição não encontrada",
        message: "Não foi encontrada inscrição com este ID para este evento",
      });
    }

    const updateData: { name?: string; phone?: string } = {};

    if (name !== undefined) {
      if (name.trim() === "") {
        return res.status(400).json({
          error: "Nome inválido",
          message: "O nome não pode ser vazio",
        });
      }
      updateData.name = name.trim();
    }

    if (phone !== undefined) {
      if (phone.trim() === "") {
        return res.status(400).json({
          error: "Telefone inválido",
          message: "O telefone não pode ser vazio",
        });
      }

      const phoneExists = await prisma.inscription.findFirst({
        where: {
          eventId: eventId,
          phone: phone.trim(),
          id: { not: inscriptionId },
        },
      });

      if (phoneExists) {
        return res.status(409).json({
          error: "Telefone em uso",
          message:
            "Já existe outro participante com este telefone neste evento",
        });
      }

      updateData.phone = phone.trim();
    }

    const updatedInscription = await prisma.inscription.update({
      where: { id: inscriptionId },
      data: updateData,
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Inscrição atualizada com sucesso!",
      data: updatedInscription,
    });
  } catch (error) {
    console.error("Erro ao atualizar inscrição:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: "Não foi possível atualizar a inscrição",
    });
  }
});

export { router as inscriptionRoutes };
