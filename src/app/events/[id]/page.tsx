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

type InscriptionFormData = { name: string; phone: string };

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const eventId = Number(id);
  const socket = useSocket();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadEvent() {
    try {
      setLoading(true);
      const res = await api.getEvent(eventId);
      setEvent(res);
    } catch {
      toast.error("Erro ao carregar evento");
    } finally {
      setLoading(false);
    }
  }

  async function handleInscription(data: InscriptionFormData) {
    if (!event) return;
    try {
      setSubmitting(true);
      await api.createInscription(eventId, data);

      const updated = await api.getEvent(eventId);
      setEvent(updated);

      if (updated.remainingCapacity === 0) {
        toast.success("Inscrição realizada! Capacidade máxima atingida.");
      } else {
        toast.success("Inscrição realizada!");
      }
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("esgotado")) {
        toast.error("Evento esgotado - não há mais vagas disponíveis");
      } else if (msg.includes("duplicada")) {
        toast.error("Telefone já inscrito neste evento");
      } else if (msg.includes("inativo")) {
        toast.error("Evento inativo - inscrições não permitidas");
      } else {
        toast.error("Erro ao realizar inscrição");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(phone: string) {
    try {
      await api.cancelInscription(eventId, phone);
      toast.success("Inscrição cancelada!");
      loadEvent();
    } catch {
      toast.error("Erro ao cancelar inscrição");
    }
  }

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!socket.isConnected) return;

    function update() {
      loadEvent();
    }

    socket.joinEventRoom(eventId);
    socket.onEventUpdate(update);

    return () => {
      socket.leaveEventRoom(eventId);
      socket.offEventUpdate(update);
    };
  }, [eventId, socket]);

  if (loading) return <LoadingSpinner message="Carregando evento..." />;

  if (!event) {
    return (
      <ErrorState
        title="Evento não encontrado"
        message="O evento solicitado não foi encontrado"
        onRetry={loadEvent}
        showBackButton
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
          <InscriptionForm
            event={event}
            onSubmit={handleInscription}
            submitting={submitting}
          />
        </div>
      </main>
    </div>
  );
}
