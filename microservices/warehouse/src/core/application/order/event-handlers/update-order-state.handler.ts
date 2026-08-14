import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
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
import { OrderEvent } from '../../../../shared/domain/events/order-event.base.js';
import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event.js';
import { ReservationEvent } from '../../../../shared/domain/events/reservation-event.base.js';
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
    private publisher: EventPublisher,
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
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsReserving();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onProductsReserved(e: ProductsReservedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsReserved();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onReservationUpdated(e: ReservationUpdatedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.reservationId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsValidating();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onOrderValidated(e: OrderValidatedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsDispatching();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onOrderValidationFailed(e: OrderValidationFailedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsRestocking();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }  }

  private async onOrderDispatched(e: OrderDispatchedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsDispatched();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onOrderDispatchFailed(e: OrderDispatchFailedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsCanceling();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onOrderDelivered(e: OrderDeliveredEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsDelivered();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onOrderCancelingRequested(e: ReservationCancelingRequestedEvent): Promise<void> {
    const order = await this.orderRepository.load(e.reservationId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsCanceling();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }

  private async onOrderCanceled(e: OrderCanceledEvent): Promise<void> {
    const order = await this.orderRepository.load(e.orderId);
    if (order) {
      const tracked = this.publisher.mergeObjectContext(order);
      tracked.markAsCanceled();
      await this.orderRepository.save(tracked);
      tracked.commit();
    }
  }
}
