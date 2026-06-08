import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderDispatchedEvent } from '../events/order-dispatched.event.js';
import type { DispatchNotifierPort } from '../ports/dispatch-notifier.port.js';
import type { OrderRepository } from '../ports/order.repository.interface.js';
import { TransferOrder } from 'src/core/domain/order/entities/transfer-order.entity.js';
import { OrderService } from '../order.service.js';
import { UpdateOrderStateDto } from '../dto/update-order-state.dto.js';
import { SellOrder } from 'src/core/domain/order/entities/sell-order.entity.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';

@EventsHandler(OrderDispatchedEvent)
export class OrderDispatchedEventHandler implements IEventHandler<OrderDispatchedEvent> {
  constructor(
    @Inject('IDispatchNotifierPort') private readonly notifier: DispatchNotifierPort,
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
    @Inject('IOrderService') private readonly orderService: OrderService,
  ) {}

  async handle(event: OrderDispatchedEvent): Promise<void> {
    const order = await this.orderRepository.load(event.orderId);
    if (!order) return;

    if (order instanceof TransferOrder) {
      await this.handleInternalOrder(
        {
          orderId: event.orderId.getId(),
          sourceWh: event.sourceWh,
          destinationWh: event.destinationWh,
        }
      );
    }

    else if (order instanceof SellOrder) {
      await this.handleSellOrder(event.orderId);
    }
  }

  private async handleInternalOrder(payload: any): Promise<void> {
    await this.notifier.notify(payload);
  }

  private async handleSellOrder(orderId: OrderId): Promise<void> {
    const dto = new UpdateOrderStateDto;
    dto.orderId = orderId.getId();
    dto.newState = 'DELIVERED';
    dto.orderType = 'SELL';
    
    await this.orderService.updateOrderStatus(dto);
  }
}
