import {
  Event,
  EventDetail,
  Inscription,
  CreateInscriptionData,
  CancelInscriptionData,
  ApiResponse,
} from "@/types/event";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || "Erro na requisição",
        response.status,
        data.details
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Erro de conexão com o servidor", 0);
  }
}

export const api = {
  // Eventos
  async getEvents(): Promise<ApiResponse<Event[]>> {
    return fetchApi<ApiResponse<Event[]>>("/api/events");
  },

  async getEvent(id: number): Promise<ApiResponse<EventDetail>> {
    return fetchApi<ApiResponse<EventDetail>>(`/api/events/${id}`);
  },

  async deleteEvent(id: number): Promise<ApiResponse<{ message: string }>> {
    return fetchApi<ApiResponse<{ message: string }>>(`/api/events/${id}`, {
      method: "DELETE",
    });
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return fetchApi<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return fetchApi<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Inscrições
  async createInscription(
    eventId: number,
    data: CreateInscriptionData
  ): Promise<ApiResponse<Inscription>> {
    return fetchApi<ApiResponse<Inscription>>(
      `/api/events/${eventId}/inscriptions`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  async cancelInscription(
    eventId: number,
    data: CancelInscriptionData
  ): Promise<ApiResponse<{ message: string }>> {
    return fetchApi<ApiResponse<{ message: string }>>(
      `/api/events/${eventId}/inscriptions`,
      {
        method: "DELETE",
        body: JSON.stringify(data),
      }
    );
  },

  async getEventInscriptions(eventId: number): Promise<
    ApiResponse<{
      event: Event;
      inscriptions: Inscription[];
      total: number;
      remaining: number;
    }>
  > {
    return fetchApi<
      ApiResponse<{
        event: Event;
        inscriptions: Inscription[];
        total: number;
        remaining: number;
      }>
    >(`/api/events/${eventId}/inscriptions`);
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return fetchApi<{ status: string; timestamp: string }>("/health");
  },
};

export { ApiError };
export type { ApiResponse };
