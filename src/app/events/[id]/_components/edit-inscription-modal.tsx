"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Inscription {
  id: number;
  name: string;
  phone: string;
  eventId: number;
  createdAt: string;
}

interface EditInscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inscription: Inscription | null;
  onSuccess: () => void;
}

const EditInscriptionModal = ({
  isOpen,
  onClose,
  inscription,
  onSuccess,
}: EditInscriptionModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (inscription) {
      setFormData({
        name: inscription.name,
        phone: inscription.phone,
      });
    }
  }, [inscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inscription) return;

    setLoading(true);

    try {
      const response = await api.updateInscription(
        inscription.eventId,
        inscription.id,
        {
          name: formData.name,
          phone: formData.phone,
        }
      );

      if (response.success) {
        toast.success("Inscrição atualizada com sucesso!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao atualizar inscrição:", error);
      toast.error("Erro ao atualizar inscrição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Inscrição</DialogTitle>
          <DialogDescription>
            Atualize as informações da inscrição
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInscriptionModal;
