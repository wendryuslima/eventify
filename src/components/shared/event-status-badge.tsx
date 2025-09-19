import { Badge } from "@/components/ui/badge";
import { getEventStatusInfo } from "@/lib/event-utils";
import { EventStatus } from "@/types/event";

interface EventStatusBadgeProps {
  status: EventStatus;
}

export const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  const statusInfo = getEventStatusInfo(status);

  return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
};
