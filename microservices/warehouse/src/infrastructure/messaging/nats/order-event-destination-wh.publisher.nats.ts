import { Injectable, Inject, Logger } from '@nestjs/common';
import type { OrderEventDestinationWhPublisher } from '../../../core/application/order/ports/order-event-destination-wh-publisher.port.js';
import { OrderCreatedEvent } from 'src/core/domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from 'src/core/domain/order/events/order-state-updated.event.js';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderEventDestinationWhPublisherNats implements OrderEventDestinationWhPublisher {
  private readonly logger = new Logger(OrderEventDestinationWhPublisherNats.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientProxy) {}

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || 'WH0'}.order.created`;
    this.logger.log(`Publishing order created event for order ${event.orderId} to warehouse via NATS`);
    await this.natsClient.emit(subject, {
      orderId: event.orderId,
      items: event.orderItems.map(item => ({
        productId: item.getId,
        qty: item.getQty,
      })),
    }).toPromise();
  }

  async publishOrderStateUpdated(event: OrderStateUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || 'WH0'}.order.state.updated`;
    this.logger.log(`Publishing order state updated event for order ${event.orderId} to warehouse via NATS`);
    await this.natsClient.emit(subject, {
      orderId: event.orderId,
      newState: event.orderState,
    }).toPromise();
  }
}
