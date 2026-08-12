import { Injectable, Inject, Logger } from '@nestjs/common';
import type { OrderEventCloudPublisher } from '../../../core/application/order/ports/order-event-cloud-publisher.port.js';
import { ClientProxy } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../../../core/domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from '../../../core/domain/order/events/order-state-updated.event.js';

@Injectable()
export class OrderEventCloudPublisherNats implements OrderEventCloudPublisher {
  private readonly logger = new Logger(OrderEventCloudPublisherNats.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientProxy) {}

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.order.created`;
    this.logger.log(`Publishing order.created to NATS cloud`);
    const payload = {
      orderId: event.orderId.getId,

      orderType: event.orderType.toString(),

      orderItems: event.orderItems.map(item => ({
        productId: item.getId.toString(),
        quantity: Number(item.getQty),
      })),

      ...(event.departure !== undefined && {
        departure: event.departure.getId,
      }),

      ...(event.destinationWh !== undefined && {
        destinationWh: event.destinationWh.getId,
      }),

      ...(event.destinationAddress !== undefined && {
        destinationAddress: {
          streetName: event.destinationAddress.streetName,
          civicNumber: event.destinationAddress.civicNumber,
          city: event.destinationAddress.city,
          cap: event.destinationAddress.cap,
          country: event.destinationAddress.country,
        },
      }),

      ...(event.orderReference !== undefined && {
        orderReference: event.orderReference,
      }),
    };

    this.natsClient.emit(subject, payload);
  }

  async publishOrderStateUpdated(event: OrderStateUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.order.state.updated`;
    this.logger.log(`Publishing order.state.updated to NATS cloud`);
    const payload = {
      orderId: event.orderId.getId(),
      orderState: event.orderState.toString(),
    };
    this.natsClient.emit(subject, payload);
  }
}
