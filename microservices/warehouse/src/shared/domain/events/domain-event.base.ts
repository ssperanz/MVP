import { IEvent } from '@nestjs/cqrs';
import * as crypto from 'crypto';
import { EventType } from '../enums/event-type';

export abstract class DomainEvent implements IEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public eventType: EventType;

  constructor() {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
  }
}
