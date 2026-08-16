import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";
import { OrderDispatchedDto } from "../../../core/application/order/dto/order-dispatched.dto";
import { OrderReceivedDto } from "../../../core/application/order/dto/order-received.dto";
import { OrderReceivedEvent } from "../../../core/application/order/events/order-received.event";
import { DeliverNotifierPort } from "../../../core/application/order/ports/deliver-notifier.port";

@Injectable()
export class DeliverNotifierPublisherNats implements DeliverNotifierPort{
  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  async notify(event: OrderReceivedEvent): Promise<void> {
    console.log(`Deliver notification sent for order ID: ${event.orderId.getId()} from warehouse ${process.env.WAREHOUSE_ID} to warehouse ${event.sourceWh}`);
    const subject = `warehouse.${event.sourceWh}.transfer.${event.destinationWh}.order.delivered`;
    const dto: OrderReceivedDto = {
      orderId: event.orderId.getId(),
      sourceWh: event.sourceWh,
      destinationWh: event.destinationWh!,
    };
    this.natsClient.emit(subject, dto);
  }

}