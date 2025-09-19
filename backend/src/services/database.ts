import { PrismaClient } from "../generated/prisma/index";

const NODE_ENV = process.env.NODE_ENV || "development";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";


const getLogConfig = (): ("query" | "info" | "warn" | "error")[] => {
  if (NODE_ENV === "production") {
    return ["error", "warn"];
  }

  switch (LOG_LEVEL) {
    case "error":
      return ["error"];
    case "warn":
      return ["error", "warn"];
    case "info":
      return ["error", "warn", "info"];
    case "debug":
    default:
      return ["query", "info", "warn", "error"];
  }
};

const prisma = new PrismaClient({
  log: getLogConfig(),
});

export { prisma };
