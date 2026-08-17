import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";
import { OrderDispatchedDto } from "../../../core/application/order/dto/order-dispatched.dto";
import { OrderDispatchedEvent } from "../../../core/application/order/events/order-dispatched.event";
import { DispatchNotifierPort } from "../../../core/application/order/ports/dispatch-notifier.port";

@Injectable()
export class DispatchNotifierPublisherNats implements DispatchNotifierPort{
  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  async notify(event: OrderDispatchedEvent): Promise<void> {
    console.log(`Dispatch notification sent for order ID: ${event.orderId.getId()} from warehouse ${event.sourceWh} to warehouse ${event.destinationWh}`);
    const subject = `warehouse.${event.sourceWh}.transfer.${event.destinationWh}.order.dispatched`;
    const dto: OrderDispatchedDto = {
      orderId: event.orderId.getId(),
      orderType: event.orderType,
      items: event.items.map(item => ({
        productId: item.productId,
        qty: item.qty,
      })),
      sourceWh: event.sourceWh,
      destinationWh: event.destinationWh!,
    };
    this.natsClient.emit(subject, dto);
  }

}