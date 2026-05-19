import { Controller } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { CancelOrderDto } from "src/core/application/order/dto/cancel-order.dto";
import { CreateOrderDto } from "src/core/application/order/dto/create-order.dto";
import { OrderDispatchedDto } from "src/core/application/order/dto/order-dispatched.dto";
import { UpdateOrderStateDto } from "src/core/application/order/dto/update-order-state.dto";
import { OrderService } from "src/core/application/order/order.service";
import { InboundOrderEventListenerPort } from "src/core/application/order/ports/inbound-order-event-listener.port";

@Controller()
export class InboundOrderEventListenerNats implements InboundOrderEventListenerPort{
  constructor(
    private readonly orderService: OrderService,
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