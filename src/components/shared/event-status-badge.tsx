import { Badge } from "@/components/ui/badge";
import { getEventStatusInfo, EventStatus } from "@/lib/event-utils";

interface EventStatusBadgeProps {
  status: EventStatus;
}

/**
 * Componente reutilizável para exibir o status de um evento
 * Seguindo o princípio Single Responsibility (SRP)
 */
export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const statusInfo = getEventStatusInfo(status);

  return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
}
