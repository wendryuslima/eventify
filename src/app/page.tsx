"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import { api, ApiError } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, MapPin } from "lucide-react";
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

  const getStatusColor = (status: string) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    return status === "ACTIVE" ? "Ativo" : "Inativo";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar eventos
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadEvents} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
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
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {event.title}
                      </CardTitle>
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusText(event.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {event.description && (
                    <CardDescription className="mb-4 line-clamp-3">
                      {event.description}
                    </CardDescription>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {event.remainingCapacity} de {event.capacity} vagas
                        disponíveis
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Criado em{" "}
                        {new Date(event.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link href={`/events/${event.id}`}>
                      <Button
                        className="w-full"
                        disabled={
                          event.status !== "ACTIVE" ||
                          event.remainingCapacity === 0
                        }
                      >
                        {event.status !== "ACTIVE"
                          ? "Evento Inativo"
                          : event.remainingCapacity === 0
                          ? "Esgotado"
                          : "Ver Detalhes"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
