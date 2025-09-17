"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventDetail } from "@/types/event";
import { api, ApiError } from "@/lib/api";
import { LoadingSpinner, ErrorState } from "@/components/shared";
import {
  EventHeader,
  EventDetailsCard,
  ParticipantsList,
  InscriptionForm,
} from "./_components";
import { toast } from "sonner";

type InscriptionFormData = {
  name: string;
  phone: string;
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.id as string);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getEvent(eventId);
      setEvent(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        toast.error("Erro ao carregar evento: " + err.message);
      } else {
        setError("Erro inesperado");
        toast.error("Erro inesperado ao carregar evento");
      }
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId, loadEvent]);

  const onSubmit = async (data: InscriptionFormData) => {
    if (!event) return;

    try {
      setSubmitting(true);
      await api.createInscription(eventId, data);
      toast.success("Inscrição realizada com sucesso!");
      loadEvent(); // Recarregar dados do evento
    } catch (err) {
      console.error("Erro na inscrição:", err);
      if (err instanceof ApiError) {
        toast.error("Erro na inscrição: " + err.message);
      } else {
        toast.error("Erro inesperado na inscrição");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelInscription = async (phone: string) => {
    if (!event) return;

    try {
      await api.cancelInscription(eventId, { phone });
      toast.success("Inscrição cancelada com sucesso!");
      loadEvent();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error("Erro ao cancelar inscrição: " + err.message);
      } else {
        toast.error("Erro inesperado ao cancelar inscrição");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando evento..." />;
  }

  if (error || !event) {
    return (
      <ErrorState
        title="Erro ao carregar evento"
        message={error || "Evento não encontrado"}
        onRetry={loadEvent}
        showBackButton={true}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventHeader event={event} onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <EventDetailsCard event={event} />
            <ParticipantsList
              event={event}
              onCancelInscription={handleCancelInscription}
            />
          </div>
          <div>
            <InscriptionForm
              event={event}
              onSubmit={onSubmit}
              submitting={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
