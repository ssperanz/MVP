import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderApplicationEvent } from '../../../../shared/application/events/order-application-event.js';
import { OrderType } from '../../../../shared/domain/enums/order-type.enum.js';
import { Address } from 'src/shared/domain/value-objects/address.vo.js';

export class OrderDispatchedEvent extends OrderApplicationEvent {
  
  constructor(
    public readonly orderId: OrderId,
    public readonly orderType: OrderType,
    public readonly items: { productId: string; qty: number }[],
    public readonly sourceWh: number,
    public readonly destinationWh?: number,
    public readonly orderReference?: OrderId
  ) {
    super(orderId);
  }
}
