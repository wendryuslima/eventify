import { EventDetail } from "@/types/event";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatternFormat } from "react-number-format";

const inscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    ),
});

type InscriptionFormData = z.infer<typeof inscriptionSchema>;

interface InscriptionFormProps {
  event: EventDetail;
  onSubmit: (data: InscriptionFormData) => void;
  submitting: boolean;
}

export function InscriptionForm({
  event,
  onSubmit,
  submitting,
}: InscriptionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<InscriptionFormData>({
    resolver: zodResolver(inscriptionSchema),
  });

  const handleFormSubmit = (data: InscriptionFormData) => {
    onSubmit(data);
    reset();
  };

  return (
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
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Inscrevendo..." : "Inscrever-se"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
