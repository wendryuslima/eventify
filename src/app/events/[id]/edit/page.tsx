"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { api, ApiResponse } from "@/lib/api";
import { EventDetail } from "@/types/event";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    capacity: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.getEvent(parseInt(eventId));
        if (response.success) {
          const event = response.data;
          setFormData({
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
  }, [eventId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.patch<ApiResponse<EventDetail>>(
        `/events/${eventId}`,
        {
          title: formData.title,
          description: formData.description || null,
          capacity: parseInt(formData.capacity),
          status: formData.status,
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Digite o título do evento"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Descreva o evento (opcional)"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="0"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleInputChange("capacity", e.target.value)
                  }
                  placeholder="Número máximo de participantes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                    handleInputChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Ativo</SelectItem>
                    <SelectItem value="INACTIVE">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
