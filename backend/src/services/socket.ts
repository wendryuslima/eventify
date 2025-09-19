import { Server } from "socket.io";

interface SocketEventData {
  eventId: number;
  eventTitle: string;
  participantName: string;
  participantPhone: string;
  remainingCapacity: number;
  totalInscriptions: number;
}

let socketInstance: Server | null = null;

export function setSocketInstance(io: Server) {
  socketInstance = io;
}

export function emitInscriptionEvent(data: SocketEventData) {
  if (!socketInstance) return;

  const roomName = `event-${data.eventId}`;

  socketInstance.to(roomName).emit("event-update", {
    type: "inscription",
    eventId: data.eventId,
    eventTitle: data.eventTitle,
    participantName: data.participantName,
    participantPhone: data.participantPhone,
    remainingCapacity: data.remainingCapacity,
    totalInscriptions: data.totalInscriptions,
    timestamp: new Date().toISOString(),
  });

  socketInstance.emit("events-list-update", {
    eventId: data.eventId,
    remainingCapacity: data.remainingCapacity,
    totalInscriptions: data.totalInscriptions,
    timestamp: new Date().toISOString(),
  });
}

export function emitCancellationEvent(data: SocketEventData) {
  if (!socketInstance) return;

  const roomName = `event-${data.eventId}`;

  socketInstance.to(roomName).emit("event-update", {
    type: "cancellation",
    eventId: data.eventId,
    eventTitle: data.eventTitle,
    participantName: data.participantName,
    participantPhone: data.participantPhone,
    remainingCapacity: data.remainingCapacity,
    totalInscriptions: data.totalInscriptions,
    timestamp: new Date().toISOString(),
  });

  socketInstance.emit("events-list-update", {
    eventId: data.eventId,
    remainingCapacity: data.remainingCapacity,
    totalInscriptions: data.totalInscriptions,
    timestamp: new Date().toISOString(),
  });
}
