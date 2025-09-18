import { Router, Request, Response } from "express";
import { prisma } from "../services/database";
import { AuditService } from "../services/audit";
import {
  emitInscriptionEvent,
  emitCancellationEvent,
} from "../services/socket";

const router = Router();

const parseId = (id: string) => {
  const parsed = parseInt(id);
  return isNaN(parsed) || parsed <= 0 ? null : parsed;
};

const validateField = (field: string | undefined) =>
  field && field.trim() !== "" ? field.trim() : null;

router.post("/:id/inscriptions", async (req: Request, res: Response) => {
  try {
    const eventId = parseId(req.params.id || "");
    const name = validateField(req.body.name);
    const phone = validateField(req.body.phone);

    if (!eventId || !name || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Campos inválidos" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { inscriptions: true } } },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento não encontrado" });
    }
    if (event.status !== "ACTIVE") {
      return res
        .status(400)
        .json({ success: false, message: "Evento inativo" });
    }
    if (event._count.inscriptions >= event.capacity) {
      return res
        .status(409)
        .json({ success: false, message: "Evento esgotado" });
    }

    const exists = await prisma.inscription.findFirst({
      where: { eventId, phone },
    });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Inscrição duplicada" });
    }

    const newInscription = await prisma.inscription.create({
      data: { name, phone, eventId },
      include: { event: { select: { title: true } } },
    });

    await AuditService.logInscriptionCreated(
      newInscription.id,
      { name, phone, eventId },
      req.ip || "unknown"
    );

    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { inscriptions: true } } },
    });

    if (updatedEvent) {
      emitInscriptionEvent({
        eventId,
        eventTitle: updatedEvent.title,
        participantName: name,
        participantPhone: phone,
        remainingCapacity:
          updatedEvent.capacity - updatedEvent._count.inscriptions,
        totalInscriptions: updatedEvent._count.inscriptions,
      });
    }

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
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Erro ao criar inscrição" });
  }
});

router.delete("/:id/inscriptions", async (req: Request, res: Response) => {
  try {
    const eventId = parseId(req.params.id || "");
    const phone = validateField(req.body.phone);

    if (!eventId || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Campos inválidos" });
    }

    const inscription = await prisma.inscription.findFirst({
      where: { eventId, phone },
    });
    if (!inscription) {
      return res
        .status(404)
        .json({ success: false, message: "Inscrição não encontrada" });
    }

    await prisma.inscription.delete({ where: { id: inscription.id } });
    await AuditService.logInscriptionCancelled(
      inscription.id,
      { name: inscription.name, phone, eventId },
      req.ip || "unknown"
    );

    const updatedEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { inscriptions: true } } },
    });

    if (updatedEvent) {
      emitCancellationEvent({
        eventId,
        eventTitle: updatedEvent.title,
        participantName: inscription.name,
        participantPhone: phone,
        remainingCapacity:
          updatedEvent.capacity - updatedEvent._count.inscriptions,
        totalInscriptions: updatedEvent._count.inscriptions,
      });
    }

    res.json({ success: true, message: "Inscrição cancelada com sucesso!" });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Erro ao cancelar inscrição" });
  }
});

router.get("/:id/inscriptions", async (req: Request, res: Response) => {
  try {
    const eventId = parseId(req.params.id || "");
    if (!eventId) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { inscriptions: { orderBy: { createdAt: "desc" } } },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Evento não encontrado" });
    }

    res.json({
      success: true,
      data: {
        event: {
          id: event.id,
          title: event.title,
          capacity: event.capacity,
          status: event.status,
        },
        inscriptions: event.inscriptions,
        total: event.inscriptions.length,
        remaining: event.capacity - event.inscriptions.length,
      },
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar inscrições" });
  }
});

router.patch(
  "/:id/inscriptions/:inscriptionId",
  async (req: Request, res: Response) => {
    try {
      const eventId = parseId(req.params.id || "");
      const inscriptionId = parseId(req.params.inscriptionId || "");
      const name = req.body.name?.trim();
      const phone = req.body.phone?.trim();

      if (!eventId || !inscriptionId) {
        return res
          .status(400)
          .json({ success: false, message: "IDs inválidos" });
      }

      const existingInscription = await prisma.inscription.findFirst({
        where: { id: inscriptionId, eventId },
      });
      if (!existingInscription) {
        return res
          .status(404)
          .json({ success: false, message: "Inscrição não encontrada" });
      }

      if (name === "") {
        return res
          .status(400)
          .json({ success: false, message: "Nome inválido" });
      }
      if (phone === "") {
        return res
          .status(400)
          .json({ success: false, message: "Telefone inválido" });
      }

      if (phone) {
        const phoneExists = await prisma.inscription.findFirst({
          where: { eventId, phone, id: { not: inscriptionId } },
        });
        if (phoneExists) {
          return res
            .status(409)
            .json({ success: false, message: "Telefone em uso" });
        }
      }

      const updatedInscription = await prisma.inscription.update({
        where: { id: inscriptionId },
        data: { ...(name && { name }), ...(phone && { phone }) },
        include: { event: { select: { id: true, title: true } } },
      });

      await AuditService.logInscriptionUpdated(
        inscriptionId,
        {
          name: existingInscription.name,
          phone: existingInscription.phone,
          eventId,
        },
        {
          name: updatedInscription.name,
          phone: updatedInscription.phone,
          eventId,
        },
        req.ip || "unknown"
      );

      res.json({
        success: true,
        message: "Inscrição atualizada com sucesso!",
        data: updatedInscription,
      });
    } catch {
      res
        .status(500)
        .json({ success: false, message: "Erro ao atualizar inscrição" });
    }
  }
);

export { router as inscriptionRoutes };
