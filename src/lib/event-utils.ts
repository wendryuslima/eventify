export type EventStatus = "ACTIVE" | "INACTIVE";

export function getEventStatusInfo(status: EventStatus) {
  if (status === "ACTIVE") {
    return {
      color: "bg-green-100 text-green-800",
      text: "Ativo",
    };
  } else {
    return {
      color: "bg-gray-100 text-gray-800",
      text: "Inativo",
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
