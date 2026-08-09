import { Reservation } from './reservation.entity';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo';
import { ProductId } from '../../../../shared/domain/value-objects/product-id.vo';
import { ProductItem } from '../../../../shared/domain/value-objects/product-item.vo';
import { Quantity } from '../../../../shared/domain/value-objects/quantity.vo';
import { ReservationState } from '../../../../shared/domain/enums/reservation-state.enum';
import { ReservationCreatedEvent } from '../events/reservation-created.event';
import { ReservationUpdatedEvent } from '../events/reservation-updated.event';
import { ReservationCompletedEvent } from '../events/reservation-completed.event';
import { ReservationCancelingRequestedEvent } from '../events/reservation-canceling-requested.event';
import { ReservationCanceledEvent } from '../events/reservation-canceled.event';

describe('Reservation Entity', () => {
  let orderId: OrderId;
  let productIdA: ProductId;
  let productIdB: ProductId;

  const buildItems = () => [
    new ProductItem(productIdA, new Quantity(2)),
    new ProductItem(productIdB, new Quantity(3)),
  ];

  beforeEach(() => {
    orderId = new OrderId('order-123');
    productIdA = new ProductId('prod-123');
    productIdB = new ProductId('prod-456');
  });

  describe('CREATE', () => {
    it('creates correctly and emits ReservationCreatedEvent', () => {
      const reservation = Reservation.create(orderId, buildItems());

      expect(reservation.getOrderId()).toEqual(orderId);
      expect(reservation.getReservationItems()).toHaveLength(2);
      expect(reservation.getState()).toBe(ReservationState.CREATED);

      const events = reservation.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ReservationCreatedEvent);
    });
  });

  describe('BASIC FLOW', () => {
    it('reserve updates state and emits ReservationUpdatedEvent', () => {
      const reservation = Reservation.create(orderId, buildItems());
      reservation.commit();

      const result = reservation.reserve([new ProductItem(productIdA, new Quantity(1))]);

      expect(result).toHaveLength(2);
      expect(reservation.getState()).toBe(ReservationState.RESERVED);
      expect(reservation.getUncommittedEvents()).toContainEqual(
        expect.any(ReservationUpdatedEvent),
      );
    });

    it('validate updates state and emits ReservationCompletedEvent', () => {
      const reservation = Reservation.create(orderId, buildItems());
      reservation.commit();

      reservation.validate();

      expect(reservation.getState()).toBe(ReservationState.VALIDATED);
      expect(reservation.getUncommittedEvents()).toContainEqual(
        expect.any(ReservationCompletedEvent),
      );
    });

    it('pause updates state and emits ReservationUpdatedEvent', () => {
      const reservation = Reservation.create(orderId, buildItems());
      reservation.commit();

      reservation.pause();

      expect(reservation.getState()).toBe(ReservationState.PENDING);
      expect(reservation.getUncommittedEvents()).toContainEqual(
        expect.any(ReservationUpdatedEvent),
      );
    });
  });

  describe('CANCELING / CANCEL', () => {
    it('requestCanceling updates state, emits event and returns reserved products', () => {
      const reservation = Reservation.create(orderId, buildItems());
      reservation.commit();

      const result = reservation.requestCanceling();

      expect(reservation.getState()).toBe(ReservationState.CANCELING);
      expect(result).toHaveLength(2);
      expect(result[0].getId()).toEqual(productIdA);
      expect(result[1].getId()).toEqual(productIdB);
      expect(reservation.getUncommittedEvents()).toContainEqual(
        expect.any(ReservationCancelingRequestedEvent),
      );
    });

    it('cancel updates state and emits ReservationCanceledEvent', () => {
      const reservation = Reservation.create(orderId, buildItems());
      reservation.commit();

      reservation.cancel();

      expect(reservation.getState()).toBe(ReservationState.CANCELED);
      expect(reservation.getUncommittedEvents()).toContainEqual(
        expect.any(ReservationCanceledEvent),
      );
    });
  });
});
