import { Injectable, Logger } from '@nestjs/common';
import { Saga, ICommand, ofType } from '@nestjs/cqrs';
import { Observable, map, of } from 'rxjs';
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
import { OrderId } from '../../../shared/domain/value-objects/order-id.vo';
import { WarehouseId } from '../../../shared/domain/value-objects/warehouse-id.vo';
import { OrderType } from '../../../shared/domain/enums/order-type.enum';
import { OrderState } from '../../../shared/domain/enums/order-state.enum';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { firstValueFrom } from 'rxjs';
import { OrderSaga } from './order.saga';

describe('OrderSaga', () => {
  let saga: OrderSaga;

  beforeEach(() => {
    saga = new OrderSaga();
  });

  describe('onOrderCreated', () => {
    it('should create a CreateReservationCommand', async () => {
      const event = new OrderCreatedEvent(
        new OrderId('order-123'),
        [],
        new WarehouseId(1),
        OrderType.SELL,
        OrderState.CREATED,
        new Money(100),
      );

      const result = await firstValueFrom(
        saga.onOrderCreated(of(event)),
      );

      expect(result).toBeInstanceOf(CreateReservationCommand);

    });
  });

  describe('onReservationCreated', () => {
    it('should create a ReserveProductsCommand', async () => {
      const event = new ReservationCreatedEvent(
        new OrderId('order-123'),
        [],
      );

      const result = await firstValueFrom(
        saga.onReservationCreated(of(event)),
      );

      expect(result).toBeInstanceOf(ReserveProductsCommand);
    });
  });

  describe('onProductsReserved', () => {
    it('should create an UpdateReservationCommand', async () => {
      const event = new ProductsReservedEvent(
        new OrderId('order-123'),
        [],
      );

      const result = await firstValueFrom(
        saga.onProductsReserved(of(event)),
      );

      expect(result).toBeInstanceOf(UpdateReservationCommand);
    });
  });

  describe('onReservationUpdated', () => {
    it('should create a ValidateOrderCommand', async () => {
      const event = new ReservationUpdatedEvent(
        new OrderId('order-123'),
      );

      const result = await firstValueFrom(
        saga.onReservationUpdated(of(event)),
      );

      expect(result).toBeInstanceOf(ValidateOrderCommand);
    });
  });

  describe('onOrderValidated', () => {
    it('should create a DispatchOrderCommand', async () => {
      const event = new OrderValidatedEvent(
        new OrderId('order-123'),
      );

      const result = await firstValueFrom(
        saga.onOrderValidated(of(event)),
      );

      expect(result).toBeInstanceOf(DispatchOrderCommand);
    });
  });

  describe('onDispatchFailed', () => {
    it('should create a CancelOrderCommand', async () => {
      const event = new OrderDispatchFailedEvent(
        new OrderId('order-123'),
        'test reason',
      );

      const result = await firstValueFrom(
        saga.onDispatchFailed(of(event)),
      );

      expect(result).toBeInstanceOf(CancelOrderCommand);
    });
  });

  describe('onReplenishmentDelivered', () => {
    it('should create a ReserveProductsCommand', async () => {
      const event = new ReplenishmentDeliveredEvent(
        new OrderId('order-123'),
        new OrderId('order-456'),
        [],
      );

      const result = await firstValueFrom(
        saga.onReplenishmentDelivered(of(event)),
      );

      expect(result).toBeInstanceOf(ReserveProductsCommand);
    });
  });

  describe('onReservationCancelingRequested', () => {
    it('should create a ReleaseProductsCommand', async () => {
      const event = new ReservationCancelingRequestedEvent(
        new OrderId('order-123'),
        [],
      );

      const result = await firstValueFrom(
        saga.onReservationCancelingRequested(of(event)),
      );

      expect(result).toBeInstanceOf(ReleaseProductsCommand);
    });
  });

  describe('onProductsReleased', () => {
    it('should create a CancelReservationCommand', async () => {
      const event = new ProductsReleasedEvent(
        new OrderId('order-123'),
        [],
      );

      const result = await firstValueFrom(
        saga.onProductsReleased(of(event)),
      );

      expect(result).toBeInstanceOf(CancelReservationCommand);
    });
  });

});