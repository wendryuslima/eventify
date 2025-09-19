import { PrismaClient } from "./src/generated/prisma/index.js";

async function runMigration() {
  const prisma = new PrismaClient();

  try {
    console.log("🔄 Iniciando migration para remover status CANCELLED...");

    // 1. Verificar se há eventos com status CANCELLED
    console.log("📊 Verificando eventos existentes...");

    // 2. Atualizar eventos CANCELLED para INACTIVE usando SQL raw
    console.log("🔄 Atualizando eventos CANCELLED para INACTIVE...");
    const updateResult = await prisma.$executeRaw`
      UPDATE events 
      SET status = 'INACTIVE' 
      WHERE status = 'CANCELLED'
    `;
    console.log(`✅ ${updateResult} eventos atualizados`);

    // 3. Verificar status atuais
    const statusCounts = await prisma.$queryRaw`
      SELECT status, COUNT(*) as count 
      FROM events 
      GROUP BY status
    `;

    console.log("📊 Status atuais dos eventos:");
    console.table(statusCounts);

    console.log("✅ Migration concluída com sucesso!");
    console.log("💡 Agora você pode executar: npx prisma db push");
  } catch (error) {
    console.error("❌ Erro durante a migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
