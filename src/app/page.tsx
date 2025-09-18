"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { api, ApiError } from "@/lib/api";
import { LoadingSpinner, ErrorState, EventCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
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
      console.error("Erro ao carregar eventos:", err);
      setError("Erro ao carregar eventos");
      toast.error("Erro ao carregar eventos");
    } finally {
      setLoading(false);
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
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {events.length} evento{events.length !== 1 ? "s" : ""}{" "}
                disponível
                {events.length !== 1 ? "is" : ""}
              </div>
              <Link href="/events/create">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Criar Evento
                </Button>
              </Link>
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
