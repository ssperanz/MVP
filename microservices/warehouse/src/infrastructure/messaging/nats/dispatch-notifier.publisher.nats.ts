import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { DispatchNotifierPort } from "src/core/application/order/ports/dispatch-notifier.port";

@Injectable()
export class DispatchNotifierPublisherNats implements DispatchNotifierPort{
  constructor(
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {}

  async notify({orderId, destWh}: { orderId: string; destWh: string }): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.order.${destWh}.incoming`;
      console.log(`Dispatch notification sent for order ID: ${orderId} to warehouse: ${destWh}`);
      await this.natsClient.emit(subject, { orderId }).toPromise();
  }

}