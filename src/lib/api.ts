const API_URL = "http://localhost:3001";

export const api = {
  async getEvents() {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    }
  },

  async getEvent(id: number) {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
      throw error;
    }
  },

  async createEvent(eventData: {
    title: string;
    description?: string;
    capacity: number;
    status?: string;
  }) {
    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      throw error;
    }
  },

  async updateEvent(
    id: number,
    eventData: {
      title?: string;
      description?: string;
      capacity?: number;
      status?: string;
    }
  ) {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
      throw error;
    }
  },

  async deleteEvent(id: number) {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      throw error;
    }
  },

  async createInscription(
    eventId: number,
    inscriptionData: { name: string; phone: string }
  ) {
    try {
      const response = await fetch(
        `${API_URL}/api/events/${eventId}/inscriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inscriptionData),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao criar inscrição:", error);
      throw error;
    }
  },

  async cancelInscription(eventId: number, phone: string) {
    try {
      const response = await fetch(
        `${API_URL}/api/events/${eventId}/inscriptions`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      throw error;
    }
  },

  async getEventInscriptions(eventId: number) {
    try {
      const response = await fetch(
        `${API_URL}/api/events/${eventId}/inscriptions`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar inscrições:", error);
      throw error;
    }
  },

  async updateInscription(
    eventId: number,
    inscriptionId: number,
    inscriptionData: { name?: string; phone?: string }
  ) {
    try {
      const response = await fetch(
        `${API_URL}/api/events/${eventId}/inscriptions/${inscriptionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inscriptionData),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao atualizar inscrição:", error);
      throw error;
    }
  },
};
