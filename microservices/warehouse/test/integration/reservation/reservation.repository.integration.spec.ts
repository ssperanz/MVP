import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ReservationRepositoryMongo,
} from '../../../src/infrastructure/persistence/mongodb/reservation.repository.mongo.js';

import {
  ReservationSchema,
  ReservationMongoSchema,
  ReservationDocument,
} from '../../../src/infrastructure/persistence/mongodb/schemas/reservation.schema.js';

import { Reservation } from '../../../src/core/domain/reservation/entities/reservation.entity.js';
import { OrderId } from '../../../src/shared/domain/value-objects/order-id.vo.js';
import { ProductId } from '../../../src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../src/shared/domain/value-objects/quantity.vo.js';
import { ReservationItem } from '../../../src/shared/domain/value-objects/reservation-item.vo.js';
import { ReservationItemState } from '../../../src/shared/domain/enums/reservation-item-state.enum.js';
import { ReservationState } from '../../../src/shared/domain/enums/reservation-state.enum.js';

describe('ReservationRepositoryMongo - Integration', () => {
  let repository: ReservationRepositoryMongo;
  let reservationModel: Model<ReservationDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          'mongodb://localhost:27018/warehouse-test',
        ),
        MongooseModule.forFeature([
          {
            name: ReservationSchema.name,
            schema: ReservationMongoSchema,
          },
        ]),
      ],
      providers: [ReservationRepositoryMongo],
    }).compile();

    repository = module.get<ReservationRepositoryMongo>(
      ReservationRepositoryMongo,
    );

    reservationModel = module.get<Model<ReservationDocument>>(
      getModelToken(ReservationSchema.name),
    );
  });

  beforeEach(async () => {
    await reservationModel.deleteMany({});
  });

  afterAll(async () => {
    await reservationModel.deleteMany({});
    await reservationModel.db.close();
  });

  it('should save and load a reservation from MongoDB', async () => {
    const orderId = new OrderId('order-123');

    const reservation = new Reservation(
      orderId,
      [
        new ReservationItem(
          new ProductId('product-1'),
          new Quantity(5),
        ),
        new ReservationItem(
          new ProductId('product-2'),
          new Quantity(10),
        ),
      ],
    );

    await repository.save(reservation);

    const loaded = await repository.load(orderId);

    expect(loaded).not.toBeNull();

    expect(loaded!.getOrderId().getId()).toBe('order-123');

    expect(loaded!.getReservationItems()).toHaveLength(2);

    expect(
      loaded!.getReservationItems()[0].getId().id,
    ).toBe('product-1');

    expect(
      loaded!.getReservationItems()[0].getQty().getValue,
    ).toBe(5);

    expect(
      loaded!.getReservationItems()[1].getId().id,
    ).toBe('product-2');

    expect(
      loaded!.getReservationItems()[1].getQty().getValue,
    ).toBe(10);
  });

  it('should return null when loading a non-existing reservation', async () => {
    const orderId = new OrderId('non-existing-order');

    const loaded = await repository.load(orderId);

    expect(loaded).toBeNull();
  });
  
  it('should return null when loading a reservation with no items', async () => {
    const orderId = new OrderId('order-no-items');

    const reservation = new Reservation(orderId, []);

    await repository.save(reservation);

    const loaded = await repository.load(orderId);

    expect(loaded).not.toBeNull();
    expect(loaded!.getReservationItems()).toHaveLength(0);
  });

  it('should update the status of an existing reservation', async () => {
    const orderId = new OrderId('order-update');

    const reservation = new Reservation(
      orderId,
      [
        new ReservationItem(
          new ProductId('product-1'),
          new Quantity(5),
        ),
      ],
    );

    await repository.save(reservation);

    reservation.validate()

    await repository.save(reservation);

    const loaded = await repository.load(orderId);

    expect(loaded!.getState()).toBe(ReservationState.VALIDATED);
  });

  it('should return all reservations', async () => {
    const reservation1 = new Reservation(
      new OrderId('order-1'),
      [
        new ReservationItem(
          new ProductId('product-1'),
          new Quantity(5),
        ),
      ],
    );

    const reservation2 = new Reservation(
      new OrderId('order-2'),
      [
        new ReservationItem(
          new ProductId('product-2'),
          new Quantity(10),
        ),
      ],
    );

    await repository.save(reservation1);
    await repository.save(reservation2);

    const reservations = await repository.loadAll();

    expect(reservations).toHaveLength(2);
  });

});