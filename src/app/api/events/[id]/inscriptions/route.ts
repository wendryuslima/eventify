// app/api/events/[id]/inscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auditService } from "@/lib/audit";
import { PrismaClient } from "@prisma/client";

const InscriptionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    ),
});

const CancelInscriptionSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    ),
});

function parseEventId(params: { id: string }) {
  const eventId = parseInt(params.id);
  if (isNaN(eventId)) throw new Error("ID do evento inválido");
  return eventId;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseEventId(params);

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );

    const inscriptions = await prisma.inscription.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(inscriptions);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseEventId(params);
    const data = InscriptionSchema.parse(await req.json());

    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { inscriptions: true } } },
      });
      if (!event) throw new Error("Evento não encontrado");
      if (event.status !== "ACTIVE")
        throw new Error("Evento não está ativo para inscrições");
      if (event._count.inscriptions >= event.capacity)
        throw new Error("Evento esgotado");

      const existing = await tx.inscription.findUnique({
        where: { eventId_phone: { eventId, phone: data.phone } },
      });
      if (existing) throw new Error("Telefone já inscrito neste evento");

      const inscription = await tx.inscription.create({
        data: { name: data.name, phone: data.phone, eventId },
      });

      return {
        inscription,
        remainingCapacity: event.capacity - event._count.inscriptions - 1,
      };
    });

    await auditService.log({
      action: "CREATE_INSCRIPTION",
      entityType: "Inscription",
      entityId: result.inscription.id,
      details: {
        eventId,
        participantName: data.name,
        phone: data.phone,
        remainingCapacity: result.remainingCapacity,
      },
    });

    return NextResponse.json(result.inscription, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { error: "Dados inválidos", details: err.errors },
        { status: 400 }
      );
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseEventId(params);
    const data = CancelInscriptionSchema.parse(await req.json());

    const inscription = await prisma.inscription.findUnique({
      where: { eventId_phone: { eventId, phone: data.phone } },
    });
    if (!inscription)
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );

    await prisma.inscription.delete({ where: { id: inscription.id } });

    await auditService.log({
      action: "DELETE_INSCRIPTION",
      entityType: "Inscription",
      entityId: inscription.id,
      details: {
        eventId,
        participantName: inscription.name,
        phone: inscription.phone,
      },
    });

    return NextResponse.json(
      { message: "Inscrição cancelada com sucesso" },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { error: "Dados inválidos", details: err.errors },
        { status: 400 }
      );
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
