import { Users } from "lucide-react";

interface EventCapacityInfoProps {
  remainingCapacity: number;
  totalCapacity: number;
}

/**
 * Componente reutilizável para exibir informações de capacidade do evento
 * Seguindo o princípio Single Responsibility (SRP)
 */
export function EventCapacityInfo({
  remainingCapacity,
  totalCapacity,
}: EventCapacityInfoProps) {
  return (
    <div className="flex items-center text-sm text-gray-600">
      <Users className="h-4 w-4 mr-1" />
      <span>
        {remainingCapacity} de {totalCapacity} vagas disponíveis
      </span>
    </div>
  );
}
