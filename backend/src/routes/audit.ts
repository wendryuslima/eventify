import { Router } from "express";
import { prisma } from "../services/database";
import type { Prisma } from "@prisma/client";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const where: Record<string, string> = {};
    if (req.query.action) where.action = String(req.query.action);
    if (req.query.entityType) where.entityType = String(req.query.entityType);

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({ success: false, message: "Erro ao buscar logs" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [stats, totalLogs] = await Promise.all([
      prisma.auditLog.groupBy({
        by: ["action"],
        _count: { action: true },
      }),
      prisma.auditLog.count(),
    ]);

    res.json({
      success: true,
      data: { totalLogs, actions: stats },
    });
  } catch {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar estatísticas" });
  }
});

export { router as auditRoutes };
