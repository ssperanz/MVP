import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderReceivedEvent } from '../events/order-received.event.js';
import type { DeliverNotifierPort } from '../ports/deliver-notifier.port.js';

@EventsHandler(OrderReceivedEvent)
export class OrderReceivedEventHandler implements IEventHandler<OrderReceivedEvent> {
  constructor(
    @Inject('IDeliverNotifierPort') private readonly notifier: DeliverNotifierPort,
  ) {}

  async handle(event: OrderReceivedEvent): Promise<void> {
    await this.notifier.notify(event);
  }
}
