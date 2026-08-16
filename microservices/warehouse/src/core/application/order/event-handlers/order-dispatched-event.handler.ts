import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderDispatchedEvent } from '../events/order-dispatched.event.js';
import type { DispatchNotifierPort } from '../ports/dispatch-notifier.port.js';
import type { OrderRepository } from '../ports/order.repository.interface.js';
import { TransferOrder } from '../../../../core/domain/order/entities/transfer-order.entity.js';

@EventsHandler(OrderDispatchedEvent)
export class OrderDispatchedEventHandler implements IEventHandler<OrderDispatchedEvent> {
  constructor(
    @Inject('IDispatchNotifierPort') private readonly notifier: DispatchNotifierPort,
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
  ) {}

  async handle(event: OrderDispatchedEvent): Promise<void> {
    const order = await this.orderRepository.load(event.orderId);
    if (!order) return;

    if (order instanceof TransferOrder) {
      await this.handleInternalOrder(
          event.orderId.getId(),
          event.sourceWh,
          event.destinationWh!
      );
    }
  }

  private async handleInternalOrder(orderId: string, sourceWh: number, destinationWh: number): Promise<void> {
    await this.notifier.notify({ orderId, sourceWh, destinationWh });
  }
}
