import { PrismaClient } from "../generated/prisma/index";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export { prisma };
