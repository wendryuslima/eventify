import { prisma } from "./database";
import { CreateEventInput, UpdateEventInput } from "../schemas/event";
import { CreateInscriptionInput } from "../schemas/inscription";

export class EventService {
  async getAllEvents() {
    const events = await prisma.event.findMany({
      include: {
        inscriptions: true,
        _count: { select: { inscriptions: true } },
      },
      orderBy: { id: "desc" },
    });
    return events;
  }

  async getEventById(id: number) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        inscriptions: true,
        _count: { select: { inscriptions: true } },
      },
    });

    if (!event) {
      throw new Error("Evento não encontrado");
    }

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

    return event;
  }

  async updateEvent(id: number, data: UpdateEventInput) {
    const event = await prisma.event.update({
      where: { id },
      data,
      include: {
        inscriptions: true,
        _count: { select: { inscriptions: true } },
      },
    });

    return event;
  }

  async deleteEvent(id: number) {
    await prisma.event.delete({ where: { id } });

    return { message: "Evento deletado com sucesso" };
  }

  async createInscription(eventId: number, data: CreateInscriptionInput) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { inscriptions: true } } },
    });

    if (!event) throw new Error("Evento não encontrado");
    if (event.status !== "ACTIVE")
      throw new Error("Evento não está ativo para inscrições");
    if (event._count.inscriptions >= event.capacity)
      throw new Error("Evento esgotado - não há mais vagas disponíveis");

    const existingInscription = await prisma.inscription.findUnique({
      where: { eventId_phone: { eventId, phone: data.phone } },
    });

    if (existingInscription)
      throw new Error("Você já está inscrito neste evento");

    const inscription = await prisma.inscription.create({
      data: { ...data, eventId },
      include: { event: true },
    });

    return inscription;
  }

  async cancelInscription(eventId: number, phone: string) {
    const inscription = await prisma.inscription.findUnique({
      where: { eventId_phone: { eventId, phone } },
      include: { event: true },
    });

    if (!inscription) throw new Error("Inscrição não encontrada");

    await prisma.inscription.delete({ where: { id: inscription.id } });

    return { message: "Inscrição cancelada com sucesso" };
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
}

export const eventService = new EventService();
