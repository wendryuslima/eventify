"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, ErrorState, EventCard } from "@/components/shared";
import { toast } from "sonner";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getEvents();
      setEvents(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        toast.error("Erro ao carregar eventos: " + err.message);
      } else {
        setError("Erro inesperado");
        toast.error("Erro inesperado ao carregar eventos");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando eventos..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Erro ao carregar eventos"
        message={error}
        onRetry={loadEvents}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Eventify</h1>
              <p className="text-gray-600 mt-1">
                Encontre e participe de eventos incríveis
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {events.length} evento{events.length !== 1 ? "s" : ""} disponível
              {events.length !== 1 ? "is" : ""}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhum evento encontrado
            </h2>
            <p className="text-gray-600">
              Não há eventos disponíveis no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
