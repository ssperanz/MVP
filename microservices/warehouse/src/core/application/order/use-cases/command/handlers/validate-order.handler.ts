import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ValidateOrderCommand } from '../validate-order.command.js';
import { OrderValidationFailedEvent } from '../../../events/order-validation-failed.event.js';
import { OrderValidatedEvent } from '../../../events/order-validated.event.js';
import type { ReservationRepository } from '../../../../../../core/application/reservation/ports/reservation.repository.interface.js';
import { WarehouseId } from '../../../../../../shared/domain/value-objects/warehouse-id.vo.js';

@CommandHandler(ValidateOrderCommand)
export class ValidateOrderCommandHandler implements ICommandHandler<ValidateOrderCommand> {
  constructor(
    @Inject('IReservationRepository') private readonly reservationRepository: ReservationRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: ValidateOrderCommand): Promise<void> {
    const reservation = await this.reservationRepository.load(command.orderId);
    if (!reservation) {
      throw new Error(`Reservation with order ID ${command.orderId.getId} not found.`);
    }
    const missingItems = reservation.getMissingItems();
    if (missingItems.length > 0) {
      this.eventBus.publish(
        new OrderValidationFailedEvent(
          new WarehouseId(Number(process.env.WAREHOUSE_ID)),
          command.orderId,
          missingItems.map((item) => ({ productId: item.getId().id, qty: item.getQty().getValue })),
        ),
      );
      reservation.pause();
    } else {
      this.eventBus.publish(new OrderValidatedEvent(command.orderId));
      reservation.validate();
    }
    await this.reservationRepository.save(reservation);
  }
}
