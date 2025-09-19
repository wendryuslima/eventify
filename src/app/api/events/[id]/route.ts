import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auditService } from "@/lib/audit";

const updateEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").optional(),
  description: z.string().optional(),
  capacity: z.number().int().min(0, "Capacidade deve ser >= 0").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "CANCELLED"]).optional(),
});

async function parseEventId(params: Promise<{ id: string }>) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  if (isNaN(id)) throw new Error("ID do evento inválido");
  return id;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const eventId = await parseEventId(params);

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        inscriptions: { orderBy: { createdAt: "desc" } },
        _count: { select: { inscriptions: true } },
      },
    });

    if (!event)
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );

    const totalInscriptions = event._count.inscriptions;
    const remainingCapacity = event.capacity - totalInscriptions;

    const eventWithCalculatedFields = {
      ...event,
      totalInscriptions,
      remainingCapacity,
    };

    return NextResponse.json(eventWithCalculatedFields);
  } catch (error) {
    console.error("GET Event Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const eventId = await parseEventId(params);
    const body = await request.json();
    const validatedData = updateEventSchema.parse(body);

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent)
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: validatedData,
    });

    await auditService.log({
      action: "UPDATE_EVENT",
      entityType: "Event",
      entityId: eventId,
      details: { changes: validatedData, previous: existingEvent },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("PATCH Event Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const eventId = await parseEventId(params);
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent)
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );

    await prisma.event.delete({ where: { id: eventId } });

    await auditService.log({
      action: "DELETE_EVENT",
      entityType: "Event",
      entityId: eventId,
      details: { deletedEvent: existingEvent },
    });

    return NextResponse.json(
      { message: "Evento excluído com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Event Error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
