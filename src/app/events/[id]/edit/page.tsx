"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { api, ApiResponse } from "@/lib/api";
import { EventDetail } from "@/types/event";
import { eventFormSchema, EventFormData } from "@/schemas/event";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);

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
      try {
        const response = await api.getEvent(parseInt(eventId));
        if (response.success) {
          const event = response.data;
          form.reset({
            title: event.title,
            description: event.description || "",
            capacity: event.capacity.toString(),
            status: event.status,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar evento:", error);
        toast.error("Erro ao carregar evento");
        router.push("/");
      } finally {
        setLoadingEvent(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, router, form]);

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);

    try {
      const response = await api.patch<ApiResponse<EventDetail>>(
        `/events/${eventId}`,
        {
          title: data.title,
          description: data.description || null,
          capacity: parseInt(data.capacity),
          status: data.status,
        }
      );

      if (response.success) {
        toast.success("Evento atualizado com sucesso!");
        router.push(`/events/${eventId}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      toast.error("Erro ao atualizar evento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o evento
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editar Evento</CardTitle>
            <CardDescription>Atualize as informações do evento</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o título do evento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o evento (opcional)"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacidade *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="Número máximo de participantes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Ativo</SelectItem>
                          <SelectItem value="INACTIVE">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Link href={`/events/${eventId}`}>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
