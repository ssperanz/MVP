import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DispatchOrderCommand } from '../dispatch-order.command.js';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { OrderDispatchedEvent } from '../../../events/order-dispatched.event.js';
import { OrderDispatchFailedEvent } from '../../../events/order-dispatch-failed.event.js';
import { TransferOrder } from '../../../../../../core/domain/order/entities/transfer-order.entity.js';

@CommandHandler(DispatchOrderCommand)
export class DispatchOrderCommandHandler implements ICommandHandler<DispatchOrderCommand> {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: DispatchOrderCommand): Promise<void> {
    const order = await this.orderRepository.load(new OrderId(command.orderId));
    if (!order) throw new Error(`Order ${command.orderId} not found`);
    if (!(order instanceof TransferOrder)) throw new Error(`Order ${command.orderId} is not a transfer order`);

    try {
      for (const item of order.getOrderItems()) {
        const product = await this.productRepository.loadById(new ProductId(item.getId().id));
        if (!product) throw new Error(`Product ${item.getId().id} not found`);
        product.dispatch(order.getOrderId(), new Quantity(item.getQty().getValue));
        await this.productRepository.save(product);
      }
      this.eventBus.publish(new OrderDispatchedEvent(order.getOrderId(), order.getWarehouseDeparture(), order.getDestinationWh().getId()));
    } catch {
      this.eventBus.publish(new OrderDispatchFailedEvent(order.getOrderId(), "Unexpected error during dispatch"));
    }
  }
}
