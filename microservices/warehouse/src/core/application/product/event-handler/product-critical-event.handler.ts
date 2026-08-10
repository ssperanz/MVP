import { EventsHandler } from "@nestjs/cqrs";
import { ProductCriticalMaxThresEvent } from "../../../../core/domain/product/events/product-critical-max-thres.event";
import { ProductCriticalMinThresEvent } from "../../../../core/domain/product/events/product-critical-min-thres.event";
import type { ProductCriticalEventPublisher } from "../ports/product-critical-event-publisher.port";

@EventsHandler(ProductCriticalMinThresEvent, ProductCriticalMaxThresEvent)
export class ProductCriticalEventHandler {
  constructor(
    private readonly criticalEventPublisher: ProductCriticalEventPublisher,
  ) {}

  async handleProductCriticalMinThresEvent(event: ProductCriticalMinThresEvent): Promise<void> {
    await this.criticalEventPublisher.publishCriticalMinThresEvent(
      event.productId.id,
      event.minThres.getValue,
      event.currentQty.getValue,
    );
  }

  async handleProductCriticalMaxThresEvent(event: ProductCriticalMaxThresEvent): Promise<void> {
    await this.criticalEventPublisher.publishCriticalMaxThresEvent(
      event.productId.id,
      event.maxThres.getValue,
      event.currentQty.getValue,
    );
  }
}