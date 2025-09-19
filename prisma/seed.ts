import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Workshop de React 19",
        description:
          "Aprenda as novidades do React 19 com hooks avançados e Server Components",
        capacity: 30,
        status: "ACTIVE",
      },
    }),
    prisma.event.create({
      data: {
        title: "Meetup de TypeScript",
        description: "Discussão sobre TypeScript avançado e melhores práticas",
        capacity: 50,
        status: "ACTIVE",
      },
    }),
    prisma.event.create({
      data: {
        title: "Conferência de DevOps",
        description: "Docker, Kubernetes e CI/CD na prática",
        capacity: 100,
        status: "ACTIVE",
      },
    }),
  ]);

  console.log(`✅ Criados ${events.length} eventos`);

  const inscriptions = await Promise.all([
    prisma.inscription.create({
      data: {
        name: "João Silva",
        phone: "(11) 99999-1111",
        eventId: events[0].id,
      },
    }),
    prisma.inscription.create({
      data: {
        name: "Maria Santos",
        phone: "(11) 99999-2222",
        eventId: events[0].id,
      },
    }),
    prisma.inscription.create({
      data: {
        name: "Pedro Costa",
        phone: "(11) 99999-3333",
        eventId: events[1].id,
      },
    }),
    prisma.inscription.create({
      data: {
        name: "Ana Oliveira",
        phone: "(11) 99999-4444",
        eventId: events[1].id,
      },
    }),
    prisma.inscription.create({
      data: {
        name: "Carlos Ferreira",
        phone: "(11) 99999-5555",
        eventId: events[2].id,
      },
    }),
  ]);

  console.log(`✅ Criadas ${inscriptions.length} inscrições`);

  console.log("🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
