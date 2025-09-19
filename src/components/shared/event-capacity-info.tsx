import { Users } from "lucide-react";

interface EventCapacityInfoProps {
  remainingCapacity: number;
  totalCapacity: number;
}

export const EventCapacityInfo = ({
  remainingCapacity,
  totalCapacity,
}: EventCapacityInfoProps) => {
  const safeRemainingCapacity = remainingCapacity ?? 0;
  const safeTotalCapacity = totalCapacity ?? 0;

  const isFull = safeRemainingCapacity === 0;
  const isAlmostFull = safeRemainingCapacity <= safeTotalCapacity * 0.1;

  return (
    <div className="flex items-center text-sm">
      <Users className="h-4 w-4 mr-1" />
      <span
        className={
          isFull
            ? "text-red-600 font-medium"
            : isAlmostFull
            ? "text-orange-600 font-medium"
            : "text-gray-600"
        }
      >
        {isFull
          ? "Evento esgotado"
          : `${safeRemainingCapacity} de ${safeTotalCapacity} vagas disponíveis`}
      </span>
    </div>
  );
};
