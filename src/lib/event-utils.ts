/**
 * Utilitários para manipulação de eventos
 * Seguindo o princípio Single Responsibility (SRP)
 */

export type EventStatus = "ACTIVE" | "INACTIVE";

export interface EventStatusInfo {
  color: string;
  text: string;
}

/**
 * Retorna informações de estilo e texto para um status de evento
 * @param status - Status do evento
 * @returns Objeto com cor e texto do status
 */
export function getEventStatusInfo(status: EventStatus): EventStatusInfo {
  const statusMap: Record<EventStatus, EventStatusInfo> = {
    ACTIVE: {
      color: "bg-green-100 text-green-800",
      text: "Ativo",
    },
    INACTIVE: {
      color: "bg-gray-100 text-gray-800",
      text: "Inativo",
    },
  };

  return statusMap[status];
}

/**
 * Verifica se um evento está disponível para inscrições
 * @param status - Status do evento
 * @param remainingCapacity - Capacidade restante
 * @returns true se o evento está disponível para inscrições
 */
export function isEventAvailableForInscription(
  status: EventStatus,
  remainingCapacity: number
): boolean {
  return status === "ACTIVE" && remainingCapacity > 0;
}

/**
 * Retorna o texto do botão baseado no status e capacidade do evento
 * @param status - Status do evento
 * @param remainingCapacity - Capacidade restante
 * @returns Texto do botão
 */
export function getEventButtonText(
  status: EventStatus,
  remainingCapacity: number
): string {
  if (status !== "ACTIVE") return "Evento Inativo";
  if (remainingCapacity === 0) return "Esgotado";
  return "Ver Detalhes";
}
