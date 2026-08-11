import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { OrderDispatchedEvent } from '../events/order-dispatched.event.js';
import type { DispatchNotifierPort } from '../ports/dispatch-notifier.port.js';
import type { OrderRepository } from '../ports/order.repository.interface.js';
import { OrderService } from '../order.service.js';
import { UpdateOrderStateDto } from '../dto/update-order-state.dto.js';
import { TransferOrder } from '../../../../core/domain/order/entities/transfer-order.entity.js';
import { SellOrder } from '../../../../core/domain/order/entities/sell-order.entity.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';
import type { OrderCommandUseCase } from '../use-cases/order.usecase.command.js';

@EventsHandler(OrderDispatchedEvent)
export class OrderDispatchedEventHandler implements IEventHandler<OrderDispatchedEvent> {
  constructor(
    @Inject('IDispatchNotifierPort') private readonly notifier: DispatchNotifierPort,
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
    @Inject('OrderCommandUseCase') private readonly orderService: OrderCommandUseCase,
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
