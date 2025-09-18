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
import { useSocket } from "@/hooks/use-socket";

type InscriptionFormData = {
  name: string;
  phone: string;
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = parseInt(params.id as string);
  const socket = useSocket();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getEvent(eventId);
      setEvent(res.data);
    } catch {
      toast.error("Erro ao carregar evento");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  async function handleInscription(data: InscriptionFormData) {
    if (!event) return;

    try {
      setSubmitting(true);
      await api.createInscription(eventId, data);
      toast.success("Inscrição realizada com sucesso!");
      loadEvent();
    } catch (err) {
      console.error("Erro na inscrição:", err);
      toast.error("Erro na inscrição");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(phone: string) {
    if (!event) return;

    try {
      await api.cancelInscription(eventId, phone);
      toast.success("Inscrição cancelada com sucesso!");
      loadEvent();
    } catch {
      toast.error("Erro ao cancelar inscrição");
    }
  }

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  useEffect(() => {
    if (socket.isConnected) {
      socket.joinEventRoom(eventId);
      socket.onEventUpdate(loadEvent);

      return () => {
        socket.leaveEventRoom(eventId);
        socket.offEventUpdate(loadEvent);
      };
    }
  }, [eventId, socket, loadEvent]);

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
              onCancelInscription={handleCancel}
              onInscriptionUpdated={loadEvent}
            />
          </div>
          <div>
            <InscriptionForm
              event={event}
              onSubmit={handleInscription}
              submitting={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
