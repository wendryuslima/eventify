import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auditService } from "@/lib/audit";

const inscriptionSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    ),
});

const cancelInscriptionSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    ),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "ID do evento inválido" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    const inscriptions = await prisma.inscription.findMany({
      where: { eventId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(inscriptions);
  } catch (error) {
    console.error("Erro ao listar inscrições:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "ID do evento inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = inscriptionSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
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
        throw new Error("Evento não encontrado");
      }

      if (event.status !== "ACTIVE") {
        throw new Error("Evento não está ativo para inscrições");
      }

      const existingInscription = await tx.inscription.findUnique({
        where: {
          eventId_phone: {
            eventId,
            phone: validatedData.phone,
          },
        },
      });

      if (existingInscription) {
        throw new Error(
          "Já existe uma inscrição com este telefone para este evento"
        );
      }

      if (event._count.inscriptions >= event.capacity) {
        throw new Error("Evento esgotado - não há mais vagas disponíveis");
      }

      const inscription = await tx.inscription.create({
        data: {
          name: validatedData.name,
          phone: validatedData.phone,
          eventId,
        },
      });

      return { inscription, event };
    });

    await auditService.log({
      action: "CREATE_INSCRIPTION",
      entityType: "Inscription",
      entityId: result.inscription.id,
      details: {
        eventId,
        participantName: validatedData.name,
        phone: validatedData.phone,
        remainingCapacity:
          result.event.capacity - result.event._count.inscriptions - 1,
      },
    });

    return NextResponse.json(result.inscription, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Erro ao criar inscrição:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: "ID do evento inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = cancelInscriptionSchema.parse(body);

    const inscription = await prisma.inscription.findUnique({
      where: {
        eventId_phone: {
          eventId,
          phone: validatedData.phone,
        },
      },
    });

    if (!inscription) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    await prisma.inscription.delete({
      where: {
        id: inscription.id,
      },
    });

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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao cancelar inscrição:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
