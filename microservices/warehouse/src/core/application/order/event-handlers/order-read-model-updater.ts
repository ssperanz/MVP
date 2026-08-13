import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AbstractOrderEventHandler } from './abstract-order-event-handler.js';
import type { OrderReadModelRepository } from '../ports/order-read-model.repository.interface.js';
import { OrderCreatedEvent } from '../../../domain/order/events/order-created.event.js';
import { OrderStateUpdatedEvent } from '../../../domain/order/events/order-state-updated.event.js';

@EventsHandler(OrderCreatedEvent, OrderStateUpdatedEvent)
export class OrderReadModelUpdater extends AbstractOrderEventHandler implements IEventHandler<any> {
  constructor(
    @Inject('IOrderReadModelRepository')
    private readonly orderReadModel: OrderReadModelRepository,
  ) {
    super();
  }

  override async onOrderCreated(event: OrderCreatedEvent): Promise<void> {
    
    await this.orderReadModel.upsert({
      orderId: event.orderId.getId(),
      orderItems: event.orderItems.map((i) => ({
        productId: i.getId().id,
        qty: i.getQty().getValue,
        unitPrice: i.getItemPrice().getAmount(),
        totalValue: i.getItemPrice().getAmount() * i.getQty().getValue,
      })),
      orderType: event.orderType,
      orderState: 'CREATED',
      orderCreationDate: event.occurredOn,
      departureWh: event.departure.getId(),
      totalOrderValue: event.totalOrderValue.getAmount(),
      destinationWh: event.destinationWh?.getId(),
      destination: event.destinationAddress ?? undefined,
      orderReference: event.orderReference?.getId(),
    });
  }

  override async onOrderStateUpdated(event: OrderStateUpdatedEvent): Promise<void> {
    const existing = await this.orderReadModel.findById(event.orderId.getId());
    if (existing) {
      existing.orderState = event.orderState;
      await this.orderReadModel.upsert(existing);
    }
  }
}
