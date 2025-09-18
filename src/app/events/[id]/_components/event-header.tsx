import { EventDetail } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface EventHeaderProps {
  event: EventDetail;
  onBack: () => void;
  onEventDeleted?: () => void;
}

export function EventHeader({
  event,
  onBack,
  onEventDeleted,
}: EventHeaderProps) {
  const router = useRouter();

  const handleDeleteEvent = async () => {
    try {
      const response = await api.deleteEvent(event.id);
      if (response.success) {
        toast.success("Evento excluído com sucesso!");
        onEventDeleted?.();
        router.push("/");
      }
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento. Tente novamente.");
    }
  };
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
          <div className="flex gap-2">
            <Link href={`/events/${event.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o evento &quot;{event.title}
                    &quot;quot;{event.title}&quot;{event.title}&quot;quot;? Esta
                    ação não pode ser desfeita e todos os dados relacionados ao
                    evento serão permanentemente removidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteEvent}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Excluir Evento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </header>
  );
}
