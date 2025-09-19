import { EventDetail } from "@/types/event";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  EventStatusBadge,
  EventCapacityInfo,
  DeleteConfirmationDialog,
} from "@/components/shared";
import { useEventOperations } from "@/hooks/use-event-operations";

interface EventHeaderProps {
  event: EventDetail;
  onBack: () => void;
  onEventDeleted?: () => void;
}

const EventHeader = ({ event, onEventDeleted }: EventHeaderProps) => {
  const { deleteEvent } = useEventOperations();

  const handleDeleteEvent = async () => {
    await deleteEvent(event.id, onEventDeleted);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <EventStatusBadge status={event.status} />
              <EventCapacityInfo
                remainingCapacity={event.remainingCapacity}
                totalCapacity={event.capacity}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/events/${event.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <DeleteConfirmationDialog
              title="Confirmar exclusão"
              description={`Tem certeza que deseja excluir o evento "${event.title}"? Esta ação não pode ser desfeita e todos os dados relacionados ao evento serão permanentemente removidos.`}
              onConfirm={handleDeleteEvent}
              confirmText="Excluir Evento"
              trigger={
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export { EventHeader };
