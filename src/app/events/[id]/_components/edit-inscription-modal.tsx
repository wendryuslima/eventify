"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatternFormat } from "react-number-format";
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

const editInscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Máximo 100 caracteres"),
  phone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine(
      (val) => val && val.replace(/\D/g, "").length >= 10,
      "O telefone é obrigatório"
    )
    .refine(
      (val) => val && /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val),
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    ),
});

type EditInscriptionFormData = z.infer<typeof editInscriptionSchema>;

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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditInscriptionFormData>({
    resolver: zodResolver(editInscriptionSchema),
  });

  useEffect(() => {
    if (inscription) {
      reset({
        name: inscription.name,
        phone: inscription.phone,
      });
    }
  }, [inscription, reset]);

  const onSubmit = async (data: EditInscriptionFormData) => {
    if (!inscription) return;

    setLoading(true);

    try {
      const response = await api.updateInscription(
        inscription.eventId,
        inscription.id,
        {
          name: data.name,
          phone: data.phone,
        }
      );

      toast.success("Inscrição atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar inscrição. Tente novamente.");
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <div className="col-span-3">
                <Input id="name" {...register("name")} className="w-full" />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <div className="col-span-3">
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PatternFormat
                      {...field}
                      format="(##) #####-####"
                      mask="_"
                      customInput={Input}
                      placeholder="(11) 99999-9999"
                      className="w-full"
                      onValueChange={(values) =>
                        field.onChange(values.formattedValue)
                      }
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
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

export { EditInscriptionModal };
