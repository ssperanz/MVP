import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { OrderRepository } from '../ports/order.repository.interface.js';
import { ReservationCreatedEvent } from '../../../domain/reservation/events/reservation-created.event.js';
import { ReservationUpdatedEvent } from '../../../domain/reservation/events/reservation-updated.event.js';
import { ReservationCancelingRequestedEvent } from '../../../domain/reservation/events/reservation-canceling-requested.event.js';
import { OrderValidatedEvent } from '../events/order-validated.event.js';
import { OrderValidationFailedEvent } from '../events/order-validation-failed.event.js';
import { OrderDispatchedEvent } from '../events/order-dispatched.event.js';
import { OrderDispatchFailedEvent } from '../events/order-dispatch-failed.event.js';
import { OrderDeliveredEvent } from '../events/order-delivered.event.js';
import { OrderCanceledEvent } from '../events/order-canceled.event.js';
import { OrderEvent } from 'src/shared/domain/events/order-event.base.js';
import { OrderApplicationEvent } from 'src/shared/application/events/order-application-event.js';
import { ReservationEvent } from 'src/shared/domain/events/reservation-event.base.js';
import { ProductsReservedEvent } from '../../product/events/products-reserved.event.js';

@EventsHandler(
  ReservationCreatedEvent, ReservationUpdatedEvent,
  ReservationCancelingRequestedEvent, ProductsReservedEvent,
  OrderValidatedEvent, OrderValidationFailedEvent,
  OrderDispatchedEvent, OrderDispatchFailedEvent,
  OrderDeliveredEvent, OrderCanceledEvent,
)
export class UpdateOrderStateHandler implements IEventHandler<OrderEvent | OrderApplicationEvent | ReservationEvent> {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
  ) {}

  async handle(event: OrderEvent | OrderApplicationEvent | ReservationEvent): Promise<void> {
    if (event instanceof ReservationCreatedEvent) return this.onReservationCreated(event);
    if (event instanceof ReservationUpdatedEvent) return this.onReservationUpdated(event);
    if (event instanceof ReservationCancelingRequestedEvent) return this.onOrderCancelingRequested(event);
    if (event instanceof ProductsReservedEvent) return this.onProductsReserved(event);
    if (event instanceof OrderValidatedEvent) return this.onOrderValidated(event);
    if (event instanceof OrderValidationFailedEvent) return this.onOrderValidationFailed(event);
    if (event instanceof OrderDispatchedEvent) return this.onOrderDispatched(event);
    if (event instanceof OrderDispatchFailedEvent) return this.onOrderDispatchFailed(event);
    if (event instanceof OrderDeliveredEvent) return this.onOrderDelivered(event);
    if (event instanceof OrderCanceledEvent) return this.onOrderCanceled(event);
  }

  private async onReservationCreated(e: ReservationCreatedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.reservationId);
    if (order) {
      order.markAsReserving();
      await this.orderRepository.save(order);
    }
  }

  private async onProductsReserved(e: ProductsReservedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      order.markAsReserved();
      await this.orderRepository.save(order);
    }
  }

  private async onReservationUpdated(e: ReservationUpdatedEvent): Promise<void> {
        const order = await this.orderRepository.load(e.reservationId);
    if (order) {
      order.markAsValidating();
      await this.orderRepository.save(order);
    }
  }

  private async onOrderValidated(e: OrderValidatedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      order.markAsDispatching();
      await this.orderRepository.save(order);
    }
  }

  private async onOrderValidationFailed(e: OrderValidationFailedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      order.markAsRestocking();
      await this.orderRepository.save(order);
    }  }

  private async onOrderDispatched(e: OrderDispatchedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      order.markAsDispatched();
      await this.orderRepository.save(order);
    }
  }

  private async onOrderDispatchFailed(e: OrderDispatchFailedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      order.markAsCanceling();
      await this.orderRepository.save(order);
    }
  }

  private async onOrderDelivered(e: OrderDeliveredEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      order.markAsDelivered();
      await this.orderRepository.save(order);
    }
  }

  private async onOrderCancelingRequested(e: ReservationCancelingRequestedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.reservationId);
    if (order) {
      order.markAsCanceling();
      await this.orderRepository.save(order);
    }
  }

  private async onOrderCanceled(e: OrderCanceledEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      order.markAsCanceled();
      await this.orderRepository.save(order);
    }
  }
}
