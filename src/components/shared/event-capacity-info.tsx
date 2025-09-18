import { Users } from "lucide-react";

interface EventCapacityInfoProps {
  remainingCapacity: number;
  totalCapacity: number;
}

export const EventCapacityInfo = ({
  remainingCapacity,
  totalCapacity,
}: EventCapacityInfoProps) => {
  return (
    <div className="flex items-center text-sm text-gray-600">
      <Users className="h-4 w-4 mr-1" />
      <span>
        {remainingCapacity} de {totalCapacity} vagas disponíveis
      </span>
    </div>
  );
};


