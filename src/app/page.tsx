"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { api } from "@/lib/api";
import { LoadingSpinner, ErrorState, EventCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSocket } from "@/hooks/use-socket";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getEvents();
      setEvents(response);
    } catch (error) {
      setError("Erro ao carregar eventos");
      toast.error("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const handleEventsListUpdate = (data: {
      eventId: number;
      remainingCapacity: number;
      totalInscriptions: number;
      timestamp: string;
    }) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === data.eventId
            ? { ...event, remainingCapacity: data.remainingCapacity }
            : event
        )
      );
    };

    socket.onEventsListUpdate(handleEventsListUpdate);
    return () => socket.offEventsListUpdate(handleEventsListUpdate);
  }, [socket]);

  if (loading) return <LoadingSpinner message="Carregando eventos..." />;
  if (error)
    return (
      <ErrorState
        title="Erro ao carregar eventos"
        message={error}
        onRetry={loadEvents}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eventify</h1>
            <p className="text-gray-600 mt-1">
              Encontre e participe de eventos incríveis
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {events?.length || 0} evento
              {(events?.length || 0) !== 1 ? "s" : ""} disponíve
              {(events?.length || 0) !== 1 ? "is" : "l"}
            </div>
            <Link href="/events/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Criar Evento
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Nenhum evento encontrado
            </h2>
            Não há eventos disponíveis no momento.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEventDeleted={loadEvents}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
