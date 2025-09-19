import { forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatternFormat } from "react-number-format";

import { EventDetail } from "@/types/event";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const inscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Máximo 100 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine(
      (val) => val && val.replace(/\D/g, "").length >= 10,
      "Telefone deve ter pelo menos 10 dígitos"
    ),
});

type InscriptionFormData = z.infer<typeof inscriptionSchema>;

interface InscriptionFormProps {
  event: EventDetail;
  onSubmit: (data: InscriptionFormData) => void;
  submitting: boolean;
}

export const InscriptionForm = forwardRef<
  { reset: () => void },
  InscriptionFormProps
>(({ event, onSubmit, submitting }, ref) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<InscriptionFormData>({
    resolver: zodResolver(inscriptionSchema),
  });

  useImperativeHandle(ref, () => ({ reset }));

  if (event.status !== "ACTIVE") {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">
            Este evento não está ativo para inscrições.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (event.remainingCapacity === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Este evento está esgotado.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" /> <span>Inscrever-se no Evento</span>
        </CardTitle>
        <CardDescription>
          Preencha os dados abaixo para se inscrever no evento.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              {...register("name")}
              className="mt-1"
              placeholder="Digite seu nome completo"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefone</Label>
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
                  className="mt-1"
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

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Inscrevendo..." : "Inscrever-se"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
});

InscriptionForm.displayName = "InscriptionForm";
