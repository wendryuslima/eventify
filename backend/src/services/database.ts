import { PrismaClient } from "../generated/prisma/index";

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public async transaction<T>(
    fn: (
      prisma: Omit<
        PrismaClient,
        "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
      >
    ) => Promise<T>
  ): Promise<T> {
    return await this.prisma.$transaction(fn, {
      timeout: 10000, 
    });
  }
}

export const db = DatabaseService.getInstance();
export const prisma = db.getPrisma();
