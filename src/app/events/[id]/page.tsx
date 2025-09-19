"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventDetail } from "@/types/event";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useSocket } from "@/hooks/use-socket";
import { LoadingSpinner, ErrorState } from "@/components/shared";
import {
  EventHeader,
  EventDetailsCard,
  ParticipantsList,
  InscriptionForm,
} from "./_components";

type InscriptionFormData = {
  name: string;
  phone: string;
};

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const eventId = parseInt(id as string);
  const socket = useSocket();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await api.getEvent(eventId);
      setEvent(res);
    } catch {
      toast.error("Erro ao carregar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleInscription = async (data: InscriptionFormData) => {
    if (!event) return;
    try {
      setSubmitting(true);
      await api.createInscription(eventId, data);
      toast.success("Inscrição realizada!");
      loadEvent();
    } catch {
      toast.error("Telefone já inscrito");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (phone: string) => {
    if (!event) return;
    try {
      await api.cancelInscription(eventId, phone);
      toast.success("Inscrição cancelada!");
      loadEvent();
    } catch {
      toast.error("Erro ao cancelar inscrição");
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!socket.isConnected) return;
    socket.joinEventRoom(eventId);
    const handleUpdate = () => loadEvent();
    socket.onEventUpdate(handleUpdate);
    return () => {
      socket.leaveEventRoom(eventId);
      socket.offEventUpdate(handleUpdate);
    };
  }, [eventId, socket]);

  if (loading) return <LoadingSpinner message="Carregando evento..." />;
  if (!event)
    return (
      <ErrorState
        title="Evento não encontrado"
        message="O evento solicitado não foi encontrado"
        onRetry={loadEvent}
        showBackButton
        onBack={() => router.push("/")}
      />
    );

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
