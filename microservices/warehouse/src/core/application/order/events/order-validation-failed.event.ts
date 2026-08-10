import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo';
import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo';

export class OrderValidationFailedEvent extends OrderApplicationEvent {
  constructor(
    public readonly sourceWh: WarehouseId,
    public readonly orderId: OrderId,
    public readonly insufficientItems: Array<{ productId: string; qty: number }>,
  ) {
    super(orderId);
  }
}
