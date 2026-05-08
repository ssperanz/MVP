import { Reservation } from "src/core/domain/reservation/entities/reservation.entity";
import { OrderId } from "src/shared/domain/value-objects/order-id.vo";

export const IReservationRepositoryToken = Symbol('IReservationRepository');

export interface ReservationRepository {
  save(reservation: Reservation): Promise<void>;
  load(reservationId: OrderId): Promise<Reservation | null>;
  loadAll(): Promise<Reservation[]>;
}
