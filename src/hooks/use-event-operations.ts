import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function useEventOperations() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createEvent = async (data: {
    title: string;
    description?: string;
    capacity: string;
    status: string;
  }) => {
    setLoading(true);
    try {
      const response = await api.createEvent({
        title: data.title,
        description: data.description || undefined,
        capacity: parseInt(data.capacity),
        status: data.status,
      });

      if (response.success) {
        toast.success("Evento criado com sucesso!");
        router.push("/");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error("Erro ao criar evento. Tente novamente.");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (
    eventId: number,
    data: {
      title: string;
      description?: string;
      capacity: string;
      status: string;
    }
  ) => {
    setLoading(true);
    try {
      const response = await api.updateEvent(eventId, {
        title: data.title,
        description: data.description || undefined,
        capacity: parseInt(data.capacity),
        status: data.status,
      });

      if (response.success) {
        toast.success("Evento atualizado com sucesso!");
        router.push(`/events/${eventId}`);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error("Erro ao atualizar evento. Tente novamente.");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId: number, onSuccess?: () => void) => {
    try {
      const response = await api.deleteEvent(eventId);
      if (response.success) {
        toast.success("Evento excluído com sucesso!");
        if (onSuccess) {
          onSuccess();
        }
        router.push("/");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      toast.error("Erro ao excluir evento. Tente novamente.");
      return { success: false, error };
    }
  };

  const loadEvent = async (eventId: number) => {
    try {
      const response = await api.getEvent(eventId);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      toast.error("Erro ao carregar evento");
      return null;
    }
  };

  return {
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    loadEvent,
  };
}
