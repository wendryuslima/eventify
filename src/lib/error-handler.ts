export const ERROR_MESSAGES = {
  esgotado: "Evento esgotado - não há mais vagas disponíveis",
  duplicada: "Telefone já inscrito neste evento",
  inativo: "Evento inativo - inscrições não permitidas",
  notFound: "Evento não encontrado",
  unauthorized: "Acesso não autorizado",
  validation: "Dados inválidos fornecidos",
} as const;

export const SUCCESS_MESSAGES = {
  inscription: "Inscrição realizada!",
  inscriptionFull: "Inscrição realizada! Capacidade máxima atingida.",
  cancellation: "Inscrição cancelada!",
  eventCreated: "Evento criado com sucesso!",
  eventUpdated: "Evento atualizado com sucesso!",
  eventDeleted: "Evento excluído com sucesso!",
} as const;

export const getErrorMessage = (errorMessage: string): string => {
  const normalizedMessage = errorMessage.toLowerCase();

  const key = Object.keys(ERROR_MESSAGES).find((keyword) =>
    normalizedMessage.includes(keyword)
  );

  return key
    ? ERROR_MESSAGES[key as keyof typeof ERROR_MESSAGES]
    : "Erro inesperado ocorreu";
};

export const getInscriptionSuccessMessage = (
  remainingCapacity: number
): string => {
  return remainingCapacity === 0
    ? SUCCESS_MESSAGES.inscriptionFull
    : SUCCESS_MESSAGES.inscription;
};

export type ErrorType = keyof typeof ERROR_MESSAGES;

export type SuccessType = keyof typeof SUCCESS_MESSAGES;
