import { PrismaClient, EventStatus } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  const eventos = [
    {
      title: "Churrasco do Lucas",
      description: "Churrasco com os amigos na casa do Lucas",
      status: EventStatus.ACTIVE,
      capacity: 10,
    },
    {
      title: "Pelada no Parque",
      description: "Futebol com a galera no parque central",
      status: EventStatus.ACTIVE,
      capacity: 10,
    },
    {
      title: "Festa de Aniversário",
      description: "Aniversário com música e comidas",
      status: EventStatus.ACTIVE,
      capacity: 10,
    },
  ];

  for (const evento of eventos) {
    const e = await prisma.event.create({ data: evento });
  
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
