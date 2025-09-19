import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auditService } from "@/lib/audit";

const createEventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  capacity: z.number().int().min(0, "Capacidade deve ser maior ou igual a 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export async function GET() {
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
        createdAt: "desc",
      },
    });

    const eventsWithCalculatedFields = events.map((event: any) => ({
      ...event,
      totalInscriptions: event._count.inscriptions,
      remainingCapacity: event.capacity - event._count.inscriptions,
    }));

    return NextResponse.json(eventsWithCalculatedFields);
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createEventSchema.parse(body);

    const event = await prisma.event.create({
      data: validatedData,
    });

    await auditService.log({
      action: "CREATE_EVENT",
      entityType: "Event",
      entityId: event.id,
      details: {
        title: event.title,
        capacity: event.capacity,
        status: event.status,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao criar evento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
