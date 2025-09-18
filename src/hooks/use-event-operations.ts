import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, ApiResponse } from "@/lib/api";
import { EventFormData } from "@/schemas/event";
import { Event, EventDetail } from "@/types/event";

/**
 * Hook customizado para operações de eventos
 * Seguindo o princípio Single Responsibility (SRP)
 */
export function useEventOperations() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * Cria um novo evento
   */
  const createEvent = async (data: EventFormData) => {
    setLoading(true);
    try {
      const response = await api.post<
        ApiResponse<{ message: string; data: Event }>
      >("/api/events", {
        title: data.title,
        description: data.description || null,
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
      console.error("Erro ao criar evento:", error);
      toast.error("Erro ao criar evento. Tente novamente.");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza um evento existente
   */
  const updateEvent = async (eventId: number, data: EventFormData) => {
    setLoading(true);
    try {
      const response = await api.patch<ApiResponse<EventDetail>>(
        `/events/${eventId}`,
        {
          title: data.title,
          description: data.description || null,
          capacity: parseInt(data.capacity),
          status: data.status,
        }
      );

      if (response.success) {
        toast.success("Evento atualizado com sucesso!");
        router.push(`/events/${eventId}`);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      toast.error("Erro ao atualizar evento. Tente novamente.");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Exclui um evento
   */
  const deleteEvent = async (eventId: number, onSuccess?: () => void) => {
    try {
      const response = await api.deleteEvent(eventId);
      if (response.success) {
        toast.success("Evento excluído com sucesso!");
        onSuccess?.();
        router.push("/");
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento. Tente novamente.");
      return { success: false, error };
    }
  };

  /**
   * Carrega um evento por ID
   */
  const loadEvent = async (eventId: number): Promise<EventDetail | null> => {
    try {
      const response = await api.getEvent(eventId);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Erro ao carregar evento:", error);
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
