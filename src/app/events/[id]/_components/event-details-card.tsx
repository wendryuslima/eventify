import { EventDetail } from "@/types/event";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface EventDetailsCardProps {
  event: EventDetail;
}

export function EventDetailsCard({ event }: EventDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Detalhes do Evento</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {event.description && (
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Descrição
            </Label>
            <p className="text-gray-600 mt-1">{event.description}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Capacidade Total
            </Label>
            <p className="text-gray-600 mt-1">{event.capacity} pessoas</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Vagas Restantes
            </Label>
            <p className="text-gray-600 mt-1">
              {event.remainingCapacity} pessoas
            </p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">
            Data de Criação
          </Label>
          <p className="text-gray-600 mt-1">
            {new Date(event.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
