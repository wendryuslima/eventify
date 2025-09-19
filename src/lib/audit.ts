import { prisma } from "./prisma";

export interface AuditLogData {
  action: string;
  entityType: string;
  entityId: number;
  details: Record<string, unknown>;
}

export const auditService = {
  async log(data: AuditLogData) {
    try {
      await prisma.auditLog.create({
        data: {
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          details: JSON.stringify(data.details),
        },
      });
    } catch (error) {
      console.error("Erro ao registrar log de auditoria:", error);
    }
  },
};
