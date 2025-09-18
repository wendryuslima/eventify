import { Badge } from "@/components/ui/badge";
import { getEventStatusInfo, EventStatus } from "@/lib/event-utils";

interface EventStatusBadgeProps {
  status: EventStatus;
}


export function EventStatusBadge({ status }: EventStatusBadgeProps) {
  const statusInfo = getEventStatusInfo(status);

  return <Badge className={statusInfo.color}>{statusInfo.text}</Badge>;
}
