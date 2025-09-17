import { prisma, db } from "./database";
import { CreateEventInput, UpdateEventInput } from "../schemas/event";
import { CreateInscriptionInput } from "../schemas/inscription";

export class EventService {
  async getAllEvents() {
    return await prisma.event.findMany({
      include: {
        inscriptions: true,
        _count: { select: { inscriptions: true } },
      },
      orderBy: { id: "desc" },
    });
  }

  async getEventById(id: number) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        inscriptions: true,
        _count: { select: { inscriptions: true } },
      },
    });

    if (!event) throw new Error("Evento não encontrado");

    return event;
  }

  async createEvent(data: CreateEventInput) {
    const event = await prisma.event.create({
      data,
      include: {
        inscriptions: true,
        _count: { select: { inscriptions: true } },
      },
    });

    await this.logAction("CREATE_EVENT", event.id, {
      title: event.title,
      capacity: event.capacity,
    });

    return event;
  }

  async updateEvent(id: number, data: UpdateEventInput) {
    const existingEvent = await this.getEventById(id);

    const event = await prisma.event.update({
      where: { id },
      data,
      include: {
        inscriptions: true,
        _count: { select: { inscriptions: true } },
      },
    });

    await this.logAction("UPDATE_EVENT", event.id, {
      changes: data,
      previous: {
        title: existingEvent.title,
        capacity: existingEvent.capacity,
        status: existingEvent.status,
      },
    });

    return event;
  }

  async deleteEvent(id: number) {
    const existingEvent = await this.getEventById(id);

    await prisma.event.delete({ where: { id } });

    await this.logAction("DELETE_EVENT", id, {
      title: existingEvent.title,
      inscriptionsCount: existingEvent.inscriptions.length,
    });

    return { message: "Evento deletado com sucesso" };
  }

  async createInscription(eventId: number, data: CreateInscriptionInput) {
    return await db.transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { inscriptions: true } } },
      });

      if (!event) throw new Error("Evento não encontrado");
      if (event.status !== "ACTIVE")
        throw new Error("Evento não está ativo para inscrições");
      if (event._count.inscriptions >= event.capacity)
        throw new Error("Evento esgotado - não há mais vagas disponíveis");

      const existingInscription = await tx.inscription.findUnique({
        where: { eventId_phone: { eventId, phone: data.phone } },
      });

      if (existingInscription)
        throw new Error("Você já está inscrito neste evento");

      const inscription = await tx.inscription.create({
        data: { ...data, eventId },
        include: { event: true },
      });

      await this.logAction("INSCRIBE", inscription.id, {
        eventId,
        participantName: data.name,
        phone: data.phone,
        remainingCapacity: event.capacity - event._count.inscriptions - 1,
      });

      return inscription;
    });
  }

  async cancelInscription(eventId: number, phone: string) {
    return await db.transaction(async (tx) => {
      const inscription = await tx.inscription.findUnique({
        where: { eventId_phone: { eventId, phone } },
        include: { event: true },
      });

      if (!inscription) throw new Error("Inscrição não encontrada");

      await tx.inscription.delete({ where: { id: inscription.id } });

      await this.logAction("CANCEL_INSCRIPTION", inscription.id, {
        eventId,
        participantName: inscription.name,
        phone: inscription.phone,
      });

      return { message: "Inscrição cancelada com sucesso" };
    });
  }

  async getEventInscriptions(eventId: number) {
    const event = await this.getEventById(eventId);

    return {
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
  }

  private async logAction(
    action: string,
    entityId: number,
    details: Record<string, unknown>
  ) {
    try {
      const safeDetails = JSON.parse(JSON.stringify(details));

      await prisma.auditLog.create({
        data: {
          action,
          entityId,
          details: safeDetails,
        },
      });
    } catch (error) {
      console.error("Erro ao criar log de auditoria:", error);
    }
  }
}

export const eventService = new EventService();
