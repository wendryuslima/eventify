import { prisma } from "./database";
import { Prisma } from "@prisma/client";


interface EventData {
  title: string;
  capacity: number;
  status: string;
}

interface InscriptionData {
  name: string;
  phone: string;
  eventId: number;
}

export class AuditService {
  static async log(
    action: string,
    entityType: string,
    entityId: number,
    details: object,
    userIp: string
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          action: action,
          entityType: entityType,
          entityId: entityId,
          userIp: userIp,
          details: details,
        },
      });
    } catch (error) {
      console.log("Erro ao salvar log:", error);
    }
  }


  static async logEventCreated(
    eventId: number,
    eventData: EventData,
    userIp: string
  ) {
    await this.log(
      "EVENT_CREATED",
      "Event",
      eventId,
      {
        title: eventData.title,
        capacity: eventData.capacity,
        status: eventData.status,
      },
      userIp
    );
  }

  static async logEventUpdated(
    eventId: number,
    oldData: EventData,
    newData: EventData,
    userIp: string
  ) {
    await this.log(
      "EVENT_UPDATED",
      "Event",
      eventId,
      {
        old: oldData,
        new: newData,
      },
      userIp
    );
  }

  static async logEventDeleted(
    eventId: number,
    eventData: EventData,
    userIp: string
  ) {
    await this.log(
      "EVENT_DELETED",
      "Event",
      eventId,
      {
        title: eventData.title,
        capacity: eventData.capacity,
        status: eventData.status,
      },
      userIp
    );
  }

  static async logInscriptionCreated(
    inscriptionId: number,
    inscriptionData: InscriptionData,
    userIp: string
  ) {
    await this.log(
      "INSCRIPTION_CREATED",
      "Inscription",
      inscriptionId,
      {
        name: inscriptionData.name,
        phone: inscriptionData.phone,
        eventId: inscriptionData.eventId,
      },
      userIp
    );
  }

  static async logInscriptionCancelled(
    inscriptionId: number,
    inscriptionData: InscriptionData,
    userIp: string
  ) {
    await this.log(
      "INSCRIPTION_CANCELLED",
      "Inscription",
      inscriptionId,
      {
        name: inscriptionData.name,
        phone: inscriptionData.phone,
        eventId: inscriptionData.eventId,
      },
      userIp
    );
  }

  static async logInscriptionUpdated(
    inscriptionId: number,
    oldData: InscriptionData,
    newData: InscriptionData,
    userIp: string
  ) {
    await this.log(
      "INSCRIPTION_UPDATED",
      "Inscription",
      inscriptionId,
      {
        old: oldData,
        new: newData,
      },
      userIp
    );
  }
}
