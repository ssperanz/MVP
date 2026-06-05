import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProductCriticalEventPublisher } from "src/core/application/product/ports/product-critical-event-publisher.port";


export class ProductCriticalEventPublisherNats implements ProductCriticalEventPublisher {
  private readonly logger = new Logger(ProductCriticalEventPublisherNats.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientProxy) {}

  async publishCriticalMinThresEvent(productId: string, minThres: number, currentQty: number): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.critical.minThres`;
    this.logger.log(`Publishing product.critical.minThres to NATS cloud`);
    this.natsClient.emit(subject, { productId, minThres, currentQty });
  }

  async publishCriticalMaxThresEvent(productId: string, maxThres: number, currentQty: number): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.critical.maxThres`;
    this.logger.log(`Publishing product.critical.maxThres to NATS cloud`);
    this.natsClient.emit(subject, { productId, maxThres, currentQty });
  }
}