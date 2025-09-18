import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

interface EventUpdateData {
  type: "inscription" | "cancellation";
  eventId: number;
  eventTitle: string;
  participantName: string;
  participantPhone: string;
  remainingCapacity: number;
  totalInscriptions: number;
  timestamp: string;
}

interface EventsListUpdateData {
  eventId: number;
  remainingCapacity: number;
  totalInscriptions: number;
  timestamp: string;
}

interface SocketEvents {
  "event-update": (data: EventUpdateData) => void;
  "events-list-update": (data: EventsListUpdateData) => void;
  "join-event": (eventId: number) => void;
  "leave-event": (eventId: number) => void;
}

export function useSocket() {
  const socketRef = useRef<Socket<SocketEvents> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only initialize socket on client side
    if (typeof window !== "undefined") {
      socketRef.current = io(SOCKET_URL);

      socketRef.current.on("connect", () => {
        setIsConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
      });

      return () => {
        socketRef.current?.disconnect();
        setIsConnected(false);
      };
    }
  }, []);

  const joinEventRoom = (eventId: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("join-event", eventId);
    }
  };

  const leaveEventRoom = (eventId: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit("leave-event", eventId);
    }
  };

  const onEventUpdate = (callback: SocketEvents["event-update"]) => {
    if (socketRef.current && isConnected) {
      socketRef.current.on("event-update", callback);
    }
  };

  const offEventUpdate = (callback: SocketEvents["event-update"]) => {
    if (socketRef.current && isConnected) {
      socketRef.current.off("event-update", callback);
    }
  };

  const onEventsListUpdate = (callback: SocketEvents["events-list-update"]) => {
    if (socketRef.current && isConnected) {
      socketRef.current.on("events-list-update", callback);
    }
  };

  const offEventsListUpdate = (
    callback: SocketEvents["events-list-update"]
  ) => {
    if (socketRef.current && isConnected) {
      socketRef.current.off("events-list-update", callback);
    }
  };

  return {
    isConnected,
    joinEventRoom,
    leaveEventRoom,
    onEventUpdate,
    offEventUpdate,
    onEventsListUpdate,
    offEventsListUpdate,
  };
}
