import { EventsHandler } from "@nestjs/cqrs";
import { ProductCriticalMaxThresEvent } from "src/core/domain/product/events/product-critical-max-thres.event";
import { ProductCriticalMinThresEvent } from "src/core/domain/product/events/product-critical-min-thres.event";
import type { ProductCriticalEventPublisher } from "../ports/product-critical-event-publisher.port";

@EventsHandler(ProductCriticalMinThresEvent, ProductCriticalMaxThresEvent)
export class ProductCriticalEventHandler {
  constructor(
    private readonly criticalEventPublisher: ProductCriticalEventPublisher,
  ) {}

  async handleProductCriticalMinThresEvent(event: ProductCriticalMinThresEvent): Promise<void> {
    await this.criticalEventPublisher.publishCriticalMinThresEvent(
      event.productId.toString(),
      event.minThres.getValue,
      event.currentQty.getValue,
    );
  }

  async handleProductCriticalMaxThresEvent(event: ProductCriticalMaxThresEvent): Promise<void> {
    await this.criticalEventPublisher.publishCriticalMaxThresEvent(
      event.productId.toString(),
      event.maxThres.getValue,
      event.currentQty.getValue,
    );
  }
}