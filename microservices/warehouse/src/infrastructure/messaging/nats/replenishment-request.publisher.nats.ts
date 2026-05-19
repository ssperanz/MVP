import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ReplenishmentRequestPort } from '../../../core/application/order/ports/replenishment-request.port.js';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReplenishmentRequestPublisherNats implements ReplenishmentRequestPort {
  private readonly logger = new Logger(ReplenishmentRequestPublisherNats.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientProxy) {}

  async requestReplenishment(
    {orderId, insufficientItems}: { orderId: string; insufficientItems: Array<{ productId: string; qty: number }> },
  ): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || 'WH0'}.replenishment.request`;
    this.logger.log(`Publishing replenishment request for order ${orderId} via NATS`);
    this.natsClient.emit(subject, {
      orderId,
      insufficientItems,
    });
  }
}
