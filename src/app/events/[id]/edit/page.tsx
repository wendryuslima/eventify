"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  NavigationBreadcrumb,
  EventForm,
  LoadingSpinner,
} from "@/components/shared";
import { useEventOperations } from "@/hooks/use-event-operations";
import { eventFormSchema, EventFormData } from "@/schemas/event";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [loadingEvent, setLoadingEvent] = useState(true);
  const { loading, updateEvent, loadEvent } = useEventOperations();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      capacity: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      const event = await loadEvent(parseInt(eventId));
      if (event) {
        form.reset({
          title: event.title,
          description: event.description || "",
          capacity: event.capacity.toString(),
          status: event.status,
        });
      }
      setLoadingEvent(false);
    };

    fetchEvent();
  }, [eventId, form, loadEvent]);

  const onSubmit = async (data: EventFormData) => {
    if (!eventId) return;
    await updateEvent(parseInt(eventId), data);
  };

  if (loadingEvent) {
    return <LoadingSpinner message="Carregando evento..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <NavigationBreadcrumb
          href={`/events/${eventId}`}
          text="Voltar para o evento"
        />

        <Card>
          <CardHeader>
            <CardTitle>Editar Evento</CardTitle>
            <CardDescription>Atualize as informações do evento</CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm
              form={form}
              onSubmit={onSubmit}
              loading={loading}
              submitText="Salvar Alterações"
              cancelHref={`/events/${eventId}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
