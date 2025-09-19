import { Event } from "@/types/event";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  EventStatusBadge,
  EventCapacityInfo,
  DeleteConfirmationDialog,
} from "./index";
import { getEventButtonText } from "@/lib/event-utils";
import { useEventOperations } from "@/hooks/use-event-operations";

interface EventCardProps {
  event: Event;
  onEventDeleted?: () => void;
}

export const EventCard = ({ event, onEventDeleted }: EventCardProps) => {
  const { deleteEvent } = useEventOperations();

  const handleDeleteEvent = async () => {
    await deleteEvent(event.id, onEventDeleted);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
            <EventStatusBadge status={event.status} />
          </div>
          <div className="flex gap-2">
            <Link href={`/events/${event.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteConfirmationDialog
              title="Confirmar exclusão"
              description={`Tem certeza que deseja excluir o evento "${event.title}"? Esta ação não pode ser desfeita.`}
              onConfirm={handleDeleteEvent}
              trigger={
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          {event.description && (
            <CardDescription className="mb-4 line-clamp-3">
              {event.description}
            </CardDescription>
          )}

          <div className="space-y-3">
            <EventCapacityInfo
              remainingCapacity={event.remainingCapacity}
              totalCapacity={event.capacity}
            />

            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                Criado em{" "}
                {new Date(event.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link href={`/events/${event.id}`}>
            <Button
              className="w-full"
              disabled={
                event.status !== "ACTIVE" || event.remainingCapacity === 0
              }
            >
              {getEventButtonText(event.status, event.remainingCapacity)}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
