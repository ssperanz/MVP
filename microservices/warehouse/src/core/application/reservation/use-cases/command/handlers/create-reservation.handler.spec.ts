import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateReservationCommand } from '../create-reservation.command.js';
import type { ReservationRepository } from '../../../ports/reservation.repository.interface.js';
import { Reservation } from '../../../../../domain/reservation/entities/reservation.entity.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { CreateReservationCommandHandler } from './create-reservation.handler.js';
import { Product } from 'src/infrastructure/persistence/mongodb/schemas/product.schema.js';
import { ProductItem } from 'src/shared/domain/value-objects/product-item.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { ReservationItem } from 'src/shared/domain/value-objects/reservation-item.vo.js';

describe('CreateReservationCommandHandler', () => {
  let commandHandler: CreateReservationCommandHandler;
  let reservationRepository: ReservationRepository;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    reservationRepository = {
      load: jest.fn(),
      save: jest.fn(),
    } as unknown as ReservationRepository;

    eventPublisher = {
      mergeObjectContext: jest.fn().mockImplementation((reservation) => reservation),
    } as unknown as EventPublisher;

    commandHandler = new CreateReservationCommandHandler(reservationRepository, eventPublisher);
  });

  it('should create a new reservation and commit the event', async () => {
    const command = new CreateReservationCommand(
      new OrderId('order-1'),
      [new ProductItem(new ProductId('product-1'), new Quantity(5))],
    );

    (reservationRepository.load as jest.Mock).mockResolvedValue(null);

    await commandHandler.execute(command);

    expect(reservationRepository.load).toHaveBeenCalledWith(command.orderId);
    expect(reservationRepository.save).toHaveBeenCalled();
    expect(eventPublisher.mergeObjectContext).toHaveBeenCalled();
  });

  it('should throw an error if the reservation already exists', async () => {
    const command = new CreateReservationCommand(
      new OrderId('order-1'),
      [new ProductItem(new ProductId('product-1'), new Quantity(5))],
    );

    (reservationRepository.load as jest.Mock).mockResolvedValue(
      new Reservation(
        command.orderId, 
        command.items.map( (item) => new ReservationItem(item.getId(), item.getQty()) )
      )  
    );

    await expect(commandHandler.execute(command)).rejects.toThrow(
      `Reservation with order ID ${command.orderId.getId()} already exists.`,
    );
  });
});