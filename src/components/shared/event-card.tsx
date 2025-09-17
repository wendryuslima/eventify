import { Event } from "@/types/event";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const getStatusColor = (status: string) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    return status === "ACTIVE" ? "Ativo" : "Inativo";
  };

  const getButtonText = () => {
    if (event.status !== "ACTIVE") return "Evento Inativo";
    if (event.remainingCapacity === 0) return "Esgotado";
    return "Ver Detalhes";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
            <Badge className={getStatusColor(event.status)}>
              {getStatusText(event.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {event.description && (
          <CardDescription className="mb-4 line-clamp-3">
            {event.description}
          </CardDescription>
        )}

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {event.remainingCapacity} de {event.capacity} vagas disponíveis
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              Criado em {new Date(event.createdAt).toLocaleDateString("pt-BR")}
            </span>
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
              {getButtonText()}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
