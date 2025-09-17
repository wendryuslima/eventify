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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar evento
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Evento não encontrado"}
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.back()} variant="outline">
              Voltar
            </Button>
            <Button onClick={loadEvent}>Tentar novamente</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getStatusColor(event.status)}>
                  {getStatusText(event.status)}
                </Badge>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>
                    {event.remainingCapacity} de {event.capacity} vagas
                    disponíveis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Event Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Detalhes do Evento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.description && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Descrição
                    </Label>
                    <p className="text-gray-600 mt-1">{event.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Capacidade Total
                    </Label>
                    <p className="text-gray-600 mt-1">
                      {event.capacity} pessoas
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Vagas Restantes
                    </Label>
                    <p className="text-gray-600 mt-1">
                      {event.remainingCapacity} pessoas
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Data de Criação
                  </Label>
                  <p className="text-gray-600 mt-1">
                    {new Date(event.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Participants List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Participantes ({event.inscriptions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event.inscriptions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum participante inscrito ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {event.inscriptions.map((inscription) => (
                      <div
                        key={inscription.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {inscription.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {inscription.phone}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleCancelInscription(inscription.phone)
                          }
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Inscription Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Inscrever-se no Evento</span>
                </CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para se inscrever no evento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {event.status !== "ACTIVE" ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">🚫</div>
                    <p className="text-gray-600">
                      Este evento não está ativo para inscrições.
                    </p>
                  </div>
                ) : event.remainingCapacity === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">😔</div>
                    <p className="text-gray-600">Este evento está esgotado.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Digite seu nome completo"
                        className="mt-1"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <PatternFormat
                            format="(##) #####-####"
                            mask="_"
                            placeholder="(11) 99999-9999"
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.formattedValue);
                            }}
                            customInput={Input}
                            className="mt-1"
                          />
                        )}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? "Inscrevendo..." : "Inscrever-se"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
