import { Badge } from "@/components/ui/badge";
import { getEventStatusInfo } from "@/lib/event-utils";
import { EventStatus } from "@/types/event";

interface EventStatusBadgeProps {
  status: EventStatus;
}

export const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  const statusInfo = getEventStatusInfo(status);

  if (status === "ACTIVE") {
    return (
      <Badge variant="outline" className="text-green-600 font-semibold">
        {statusInfo.text}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={statusInfo.color}>
      {statusInfo.text}
    </Badge>
  );
};
