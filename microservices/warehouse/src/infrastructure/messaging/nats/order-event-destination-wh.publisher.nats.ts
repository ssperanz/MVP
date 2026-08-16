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
    /*
    const subject = `warehouse.${process.env.WH_ID || '0'}.mirror.${event.destinationWh?.getId() || '0'}.order.created`;
    this.logger.log(`Publishing order created event for order ${event.orderId.getId()} to warehouse via NATS`);
    this.natsClient.emit(subject, {
      orderId: event.orderId,
      items: event.orderItems.map(item => ({
        productId: item.getId().id,
        qty: item.getQty().getValue,
      })),/*

          public readonly departure: WarehouseId,
          public readonly orderType: OrderType,
          public readonly orderState: OrderState,
          public readonly totalOrderValue: Money,
          public readonly destinationWh?: WarehouseId,
          public readonly destinationAddress?: {
            streetName: string;
            civicNumber: number;
            city: string;
            cap: string;
            country: string;
          },
          public readonly orderReference?: OrderId,
      destinationWh: event.destinationWh?.getId() || '0'
      
    })*/
  }

  async publishOrderStateUpdated(event: OrderStateUpdatedEvent): Promise<void> {
    /*const subject = `warehouse.${process.env.WH_ID || '0'}.mirror.${event.destinationWh?.getId() || '0'}.order.state.updated`;
    this.logger.log(`Publishing order state updated event for order ${event.orderId.getId()} to warehouse via NATS`);
    this.natsClient.emit(subject, {
      orderId: event.orderId,
      newState: event.orderState,
    });*/
  }
}
