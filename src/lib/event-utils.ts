import { EventStatus } from "@/types/event";

export function getEventStatusInfo(status: EventStatus) {
  switch (status) {
    case "ACTIVE":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Ativo",
      };
    case "INACTIVE":
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        text: "Inativo",
      };
    case "CANCELLED":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Cancelado",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        text: "Desconhecido",
      };
  }
}

export function isEventAvailableForInscription(
  status: EventStatus,
  remainingCapacity: number
) {
  if (status === "ACTIVE" && remainingCapacity > 0) {
    return true;
  } else {
    return false;
  }
}

export function getEventButtonText(
  status: EventStatus,
  remainingCapacity: number
) {
  if (status === "CANCELLED") {
    return "Evento Cancelado";
  }

  if (status !== "ACTIVE") {
    return "Evento Inativo";
  }

  if (remainingCapacity === 0) {
    return "Esgotado";
  }

  return "Ver Detalhes";
}
