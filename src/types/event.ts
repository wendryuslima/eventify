export type EventStatus = "ACTIVE" | "INACTIVE";

export interface Event {
  id: number;
  title: string;
  description: string | null;
  status: EventStatus;
  capacity: number;
  totalInscriptions: number;
  remainingCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventDetail extends Event {
  inscriptions: Inscription[];
}

export interface Inscription {
  id: number;
  name: string;
  phone: string;
  eventId: number;
  createdAt: string;
}

export interface CreateInscriptionData {
  name: string;
  phone: string;
}

export interface CancelInscriptionData {
  phone: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
