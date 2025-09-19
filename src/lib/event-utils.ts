import { EventStatus } from "@/types/event";

export function getEventStatusInfo(status: EventStatus) {
  switch (status) {
    case "ACTIVE":
      return {
        color: "bg-green-500 text-green-800 border-green-600 font-semibold",
        text: "Ativo",
      };
    case "INACTIVE":
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        text: "Inativo",
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
  if (status !== "ACTIVE") {
    return "Evento Inativo";
  }

  if (remainingCapacity === 0) {
    return "Esgotado";
  }

  return "Ver Detalhes";
}
