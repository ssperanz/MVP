import { Injectable, Logger } from '@nestjs/common';
import { Saga, ICommand, ofType } from '@nestjs/cqrs';
import { Observable, filter, map } from 'rxjs';
import { OrderCreatedEvent } from '../../../core/domain/order/events/order-created.event';
import { ReservationCreatedEvent } from '../../../core/domain/reservation/events/reservation-created.event';
import { CreateReservationCommand } from '../reservation/use-cases/command/create-reservation.command';
import { ReserveProductsCommand } from '../product/use-cases/command/reserve-products.command';
import { UpdateReservationCommand } from '../reservation/use-cases/command/update-reservation.command';
import { ProductsReservedEvent } from '../product/events/products-reserved.event';
import { ReservationUpdatedEvent } from '../../../core/domain/reservation/events/reservation-updated.event';
import { ValidateOrderCommand } from '../order/use-cases/command/validate-order.command';
import { DispatchOrderCommand } from '../order/use-cases/command/dispatch-order.command';
import { OrderDispatchFailedEvent } from '../order/events/order-dispatch-failed.event';
import { CancelOrderCommand } from '../order/use-cases/command/cancel-order.command';
import { ReplenishmentDeliveredEvent } from '../order/events/replenishment-delivered.event';
import { CancelReservationCommand } from '../reservation/use-cases/command/cancel-reservation.command';
import { ProductsReleasedEvent } from '../product/events/products-released.event';
import { ReleaseProductsCommand } from '../product/use-cases/command/release-products.command';
import { ReservationCancelingRequestedEvent } from '../../../core/domain/reservation/events/reservation-canceling-requested.event';
import { OrderValidatedEvent } from '../order/events/order-validated.event';
import { OrderDispatchedEvent } from '../order/events/order-dispatched.event';
import { OrderType } from '../../../shared/domain/enums/order-type.enum';
import { DeliverOrderCommand } from '../order/use-cases/command/deliver-order.command';
import { OrderDeliveredEvent } from '../order/events/order-delivered.event';

@Injectable()
export class OrderSaga {
  /* Step 1: When an OrderCreatedEvent is emitted, we want to create a reservation for that order. */
  private readonly logger = new Logger(OrderSaga.name);
  @Saga()
  onOrderCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderCreatedEvent),
      map((event) => {
        this.logger.log(`Received OrderCreatedEvent for order ID ${event.orderId.getId()}`);
        return new CreateReservationCommand(event.orderId, event.orderItems);
      }),
    );
  }

  /* Step 2: When a ReservationCreatedEvent is emitted, we want to actually reserve the products. */
  @Saga()
  onReservationCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ReservationCreatedEvent),
      map((event) => {
        this.logger.log(`Received ReservationCreatedEvent for order ID ${event.reservationId.getId()}`);
        return new ReserveProductsCommand(event.reservationId, event.reservationItems);
      }),
    );
  }

  /* Step 3: When a ProductsReservedEvent is emitted, we want to update the reservation with the actual reserved quantities. */
  @Saga()
  onProductsReserved = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ProductsReservedEvent),
      map((event) => {
        this.logger.log(`Received ProductsReservedEvent for reservation ID ${event.orderId.getId()}`);
        return new UpdateReservationCommand(event.orderId, event.itemsReserved);
      }),
    );
  }

  /* Step 4: When a ReservationUpdatedEvent is emitted, we want to validate the order. */
  @Saga()
  onReservationUpdated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ReservationUpdatedEvent),
      map((event) => {
        this.logger.log(`Received ReservationUpdatedEvent for reservation ID ${event.reservationId.getId()}`);
        return new ValidateOrderCommand(event.reservationId);
      }),
    );
  }

  /* Step 5: If order is validated, we want to dispatch */
  @Saga()
  onOrderValidated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderValidatedEvent),
      map((event) => {
        this.logger.log(`Received OrderValidatedEvent for order ID ${event.orderId.getId()}`);
        return new DispatchOrderCommand(event.orderId.getId());
      }),
    );
  }

  /* Step 6: If order is dispatched, we want to deliver it. */
  @Saga()
  onOrderDispatched = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderDispatchedEvent),
      filter((event) => event.orderType === OrderType.SELL),
      map((event) => {
        this.logger.log(`Received OrderDispatchedEvent for ${event.orderType} Order with order ID ${event.orderId.getId()}`);
        return new DeliverOrderCommand(
          event.orderId.getId(),
          event.orderType,
          event.items.map((item) => ({ productId: item.productId, qty: item.qty })),
          event.sourceWh,
          event.destinationWh,
        );
      }),
    );
  }

  /* NB: TransferOrder and ReplenishmentOrder are not handled by this saga, because it has to be handled by a different warehouse. */

  /* Replenishment Delivered case: When a ReplenishmentDeliveredEvent is emitted, we want to reserve the replenished products for the original order. */
  @Saga()
  onReplenishmentDelivered = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ReplenishmentDeliveredEvent),
      map((event) => {
        this.logger.log(`Received ReplenishmentDeliveredEvent for order ID ${event.orderId.getId()}`);
        return new ReserveProductsCommand(event.orderReference, event.replenishedItems);
      }),
    );
  }

  /* Dispatch Failure case: If order dispatch fails, we want to cancel the order. */
  @Saga()
  onDispatchFailed = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(OrderDispatchFailedEvent),
      map((event) => {
        this.logger.log(`Received OrderDispatchFailedEvent for order ID ${event.orderId.getId()}`);
        return new CancelOrderCommand(event.orderId.getId());
      }),
    );
  }

  /* Cancel Order case: When a ReservationCancelingRequestedEvent is emitted, we want to release the reserved products and cancel the reservation. */
  @Saga()
  onReservationCancelingRequested = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ReservationCancelingRequestedEvent),
      map((event) => {
        this.logger.log(`Received ReservationCancelingRequestedEvent for order ID ${event.reservationId.getId()}`);
        return new ReleaseProductsCommand(event.reservationId, event.toUnreserveItems);
      }),
    );
  }

  /* After products are released, we want to set the reservation as canceled. */
  @Saga()
  onProductsReleased = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ProductsReleasedEvent),
      map((event) => {
        this.logger.log(`Received ProductsReleasedEvent for order ID ${event.orderId.getId()}`);
        return new CancelReservationCommand(event.orderId);
      }),
    );
  }

}