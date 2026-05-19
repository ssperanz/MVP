import { Injectable, Inject, Logger } from '@nestjs/common';
import type { OrderEventCloudPublisher } from '../../../core/application/order/ports/order-event-cloud-publisher.port.js';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderEventCloudPublisherNats implements OrderEventCloudPublisher {
  private readonly logger = new Logger(OrderEventCloudPublisherNats.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientProxy) {}

  async publishOrderCreated(payload: any): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.order.created`;
    this.logger.log(`Publishing order.created to NATS cloud`);
    this.natsClient.emit(subject, payload);
  }

  async publishOrderStateUpdated(payload: any): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.order.state.updated`;
    this.logger.log(`Publishing order.state.updated to NATS cloud`);
    this.natsClient.emit(subject, payload);
  }
}
