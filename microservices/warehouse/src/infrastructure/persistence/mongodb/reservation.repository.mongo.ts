import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReservationRepository } from '../../../core/application/reservation/ports/reservation.repository.interface.js';
import { Reservation } from '../../../core/domain/reservation/entities/reservation.entity.js';
import { OrderId } from '../../../shared/domain/value-objects/order-id.vo.js';
import { ProductId } from '../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../shared/domain/value-objects/quantity.vo.js';
import { ReservationItem } from '../../../shared/domain/value-objects/reservation-item.vo.js';
import { ReservationState } from '../../../shared/domain/enums/reservation-state.enum.js';
import { ReservationItemState } from '../../../shared/domain/enums/reservation-item-state.enum.js';
import { ReservationDocument, ReservationSchema } from './schemas/reservation.schema.js';

@Injectable()
export class ReservationRepositoryMongo implements ReservationRepository {
  constructor(
    @InjectModel(ReservationSchema.name) private reservationModel: Model<ReservationDocument>,
  ) {}

  async save(reservation: Reservation): Promise<void> {
    const data = {
      orderId: reservation.getOrderId().getId(),
      reservedItems: reservation.getReservationItems().map((ri) => ({
        productId: ri.getId().id,
        qty: ri.getQty().getValue,
        reservedQty: ri.getReservedQty().getValue,
        state: ri.getState(),
      })),
      state: reservation.getState(),
    };

    await this.reservationModel.findOneAndUpdate(
      { orderId: data.orderId },
      { $set: data },
      { upsert: true, returnDocument: 'after' },
    ).exec();
  }

  async load(orderId: OrderId): Promise<Reservation | null> {
    const doc = await this.reservationModel.findOne({ orderId: orderId.getId() }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async loadAll(): Promise<Reservation[]> {
    const docs = await this.reservationModel.find().exec();
    return docs.map((d) => this.toDomain(d));
  }

  private toDomain(doc: ReservationDocument): Reservation {
    const items = doc.reservedItems.map(
      (ri) => ReservationItem.restore(
        new ProductId(ri.productId),
        new Quantity(ri.qty),
        new Quantity(ri.reservedQty),
        ri.state as ReservationItemState,
      ),
    );
    return Reservation.restore(
      new OrderId(doc.orderId),
      items,
      doc.state as ReservationState,
    );
  }
}
