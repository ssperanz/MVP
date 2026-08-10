import { Controller, Inject } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { CancelOrderDto } from "../../../core/application/order/dto/cancel-order.dto";
import { CreateOrderDto } from "../../../core/application/order/dto/create-order.dto";
import { OrderDispatchedDto } from "../../../core/application/order/dto/order-dispatched.dto";
import { UpdateOrderStateDto } from "../../../core/application/order/dto/update-order-state.dto";
import { InboundOrderEventListenerPort } from "../../../core/application/order/ports/inbound-order-event-listener.port";
import type { OrderCommandUseCase } from "src/core/application/order/use-cases/order.usecase.command";

@Controller()
export class InboundOrderEventListenerNats implements InboundOrderEventListenerPort{
  constructor(
    @Inject('OrderCommandUseCase')
    private readonly orderService: OrderCommandUseCase,
  ) {}

  @EventPattern(`warehouse.${process.env.WAREHOUSE_ID}.order.created`)
  async handleOrderCreated(dto: CreateOrderDto): Promise<void> {
    await this.orderService.createOrder(dto);
  }

  @EventPattern(`warehouse.${process.env.WAREHOUSE_ID}.order.incoming`)
  async handleInternalOrderArrival(dto: OrderDispatchedDto): Promise<void> {
    await this.orderService.deliverOrder(dto);
  }

  @EventPattern(`warehouse.${process.env.WAREHOUSE_ID}.order.status.updated`)
  async handleOrderStatusUpdated(dto: UpdateOrderStateDto): Promise<void> {
    await this.orderService.updateOrderStatus(dto);
  }

  @EventPattern(`warehouse.${process.env.WAREHOUSE_ID}.order.cancelled`)
  async handleOrderCancelledEvent(dto: CancelOrderDto): Promise<void> {
    await this.orderService.cancelOrder(dto);
  }

}