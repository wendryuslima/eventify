"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavigationBreadcrumb, EventForm } from "@/components/shared";
import { useEventOperations } from "@/hooks/use-event-operations";
import { eventFormSchema, EventFormData } from "@/schemas/event";

export default function CreateEventPage() {
  const { loading, createEvent } = useEventOperations();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      capacity: "",
      status: "ACTIVE",
    },
  });

  const onSubmit = async (data: EventFormData) => {
    await createEvent(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <NavigationBreadcrumb href="/" text="Voltar para eventos" />

        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Evento</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar um novo evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm
              form={form}
              onSubmit={onSubmit}
              loading={loading}
              submitText="Criar Evento"
              cancelHref="/"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
