"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventDetail } from "@/types/event";
import { api } from "@/lib/api";
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

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = parseInt(params.id as string);

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getEvent(eventId);
      setEvent(response.data);
    } catch (err) {
      toast.error("Erro ao carregar evento");
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
      toast.error("Erro na inscrição");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelInscription = async (phone: string) => {
    if (!event) return;

    try {
      await api.cancelInscription(eventId, phone);
      toast.success("Inscrição cancelada com sucesso!");
      loadEvent();
    } catch (err) {
      toast.error("Erro ao cancelar inscrição");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando evento..." />;
  }

  if (!event) {
    return (
      <ErrorState
        title="Evento não encontrado"
        message="O evento solicitado não foi encontrado"
        onRetry={loadEvent}
        showBackButton={true}
        onBack={() => router.push("/")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EventHeader
        event={event}
        onBack={() => router.push("/")}
        onEventDeleted={() => router.push("/")}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <EventDetailsCard event={event} />
            <ParticipantsList
              event={event}
              onCancelInscription={handleCancelInscription}
              onInscriptionUpdated={loadEvent}
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
};

export default EventDetailPage;
