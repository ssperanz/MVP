import { IEvent } from '@nestjs/cqrs';
import * as crypto from 'crypto';
import { EventType } from '../../domain/enums/event-type.enum';
import { OrderId } from '../../../shared/domain/value-objects/order-id.vo';

export abstract class ProductApplicationEvent implements IEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly eventType: EventType;

  constructor(public readonly orderId: OrderId) {
    this.eventId = crypto.randomUUID();
    this.occurredOn = new Date();
    this.eventType = EventType.Product;
  }
}
