import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, EventPattern } from "@nestjs/microservices";
import { DispatchNotifierPort } from "src/core/application/order/ports/dispatch-notifier.port";

@Injectable()
export class DispatchNotifierPublisherNats implements DispatchNotifierPort{
  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  async notify({orderId, sourceWh, destinationWh}: { orderId: string; sourceWh: number; destinationWh: number }): Promise<void> {
    console.log(`Dispatch notification sent for order ID: ${orderId} from warehouse: ${process.env.WAREHOUSE_ID} to warehouse: ${destinationWh}`);
    const subject = `warehouse.${sourceWh}.mirror.${destinationWh}.order.dispatched`;
    this.natsClient.emit(subject, { orderId, sourceWh, destinationWh });
  }

}