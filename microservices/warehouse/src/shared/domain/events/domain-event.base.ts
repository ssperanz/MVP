import { IEvent } from '@nestjs/cqrs';
import * as crypto from 'crypto';

export abstract class DomainEvent implements IEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;

  constructor() {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
  }
}
