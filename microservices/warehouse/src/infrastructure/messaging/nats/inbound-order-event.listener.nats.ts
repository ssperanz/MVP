import { Controller, Inject } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { CancelOrderDto } from "../../../core/application/order/dto/cancel-order.dto";
import { OrderDispatchedDto } from "../../../core/application/order/dto/order-dispatched.dto";
import { UpdateOrderStateDto } from "../../../core/application/order/dto/update-order-state.dto";
import { InboundOrderEventListenerPort } from "../../../core/application/order/ports/inbound-order-event-listener.port";
import type { OrderCommandUseCase } from "../../../core/application/order/use-cases/order.usecase.command";
import { CreateOrderDto } from "../../../core/application/order/dto/create-order.dto";
import { OrderReceivedDto } from "../../../core/application/order/dto/order-received.dto";

@Controller()
export class InboundOrderEventListenerNats implements InboundOrderEventListenerPort{
  constructor(
    @Inject('OrderCommandUseCase')
    private readonly orderService: OrderCommandUseCase,
  ) {}

  @EventPattern(`warehouse.*.transfer.${process.env.WAREHOUSE_ID}.order.dispatched`)
  async handleInternalOrderArrival(dto: OrderDispatchedDto): Promise<void> {
    console.log(`Received order dispatched event for order ID: ${dto.orderId} from warehouse ${dto.sourceWh} to warehouse ${dto.destinationWh}`);
    await this.orderService.deliverOrder(dto);
  }

  @EventPattern(`warehouse.${process.env.WAREHOUSE_ID}.transfer.*.order.delivered`)
  async handleOrderDelivered(dto: OrderReceivedDto): Promise<void> {
    console.log(`Received order delivered event for order ID: ${dto.orderId} at warehouse ${dto.destinationWh}`);
    await this.orderService.notifySuccessfulDeliver(dto);
  }

  @EventPattern(`warehouse.*.mirror.${process.env.WAREHOUSE_ID}.order.created`)
  async handleOrderCreated(dto: CreateOrderDto): Promise<void> {
    await this.orderService.createOrder(dto);
  }

  

  @EventPattern(`warehouse.*.mirror.${process.env.WAREHOUSE_ID}.order.status.updated`)
  async handleOrderStatusUpdated(dto: UpdateOrderStateDto): Promise<void> {
    await this.orderService.updateOrderStatus(dto);
  }

  @EventPattern(`warehouse.*.mirror.${process.env.WAREHOUSE_ID}.order.cancelled`)
  async handleOrderCancelledEvent(dto: CancelOrderDto): Promise<void> {
    await this.orderService.cancelOrder(dto);
  }

}