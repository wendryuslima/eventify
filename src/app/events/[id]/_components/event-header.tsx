import { EventDetail } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users } from "lucide-react";

interface EventHeaderProps {
  event: EventDetail;
  onBack: () => void;
}

export function EventHeader({ event, onBack }: EventHeaderProps) {
  const getStatusColor = (status: string) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    return status === "ACTIVE" ? "Ativo" : "Inativo";
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className={getStatusColor(event.status)}>
                {getStatusText(event.status)}
              </Badge>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>
                  {event.remainingCapacity} de {event.capacity} vagas
                  disponíveis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
