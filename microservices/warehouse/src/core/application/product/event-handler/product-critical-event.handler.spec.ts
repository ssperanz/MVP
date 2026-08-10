import { EventsHandler } from "@nestjs/cqrs";
import type { ProductCriticalEventPublisher } from "../ports/product-critical-event-publisher.port";
import { ProductCriticalMaxThresEvent } from "../../../../core/domain/product/events/product-critical-max-thres.event";
import { ProductCriticalMinThresEvent } from "../../../../core/domain/product/events/product-critical-min-thres.event";
import { ProductId } from "../../../../shared/domain/value-objects/product-id.vo";
import { Quantity } from "../../../../shared/domain/value-objects/quantity.vo";
import { ProductCriticalEventHandler } from "./product-critical-event.handler";

describe('ProductCriticalEventHandler', () => {
  let criticalEventPublisherMock: jest.Mocked<ProductCriticalEventPublisher>;
  let eventHandler: ProductCriticalEventHandler;

  beforeEach(() => {
    criticalEventPublisherMock = {
      publishCriticalMinThresEvent: jest.fn(),
      publishCriticalMaxThresEvent: jest.fn(),
    } as unknown as jest.Mocked<ProductCriticalEventPublisher>;

    eventHandler = new ProductCriticalEventHandler(criticalEventPublisherMock);
  });

  it('should handle ProductCriticalMinThresEvent and call the publisher', async () => {
    const productId = 'product-1';
    const minThres = 5;
    const currentQty = 3;
    const event = new ProductCriticalMinThresEvent(new ProductId(productId), new Quantity(minThres), new Quantity(currentQty));

    await eventHandler.handleProductCriticalMinThresEvent(event);

    expect(criticalEventPublisherMock.publishCriticalMinThresEvent).toHaveBeenCalledWith(
      productId,
      minThres,
      currentQty,
    );
  });

  it('should handle ProductCriticalMaxThresEvent and call the publisher', async () => {
    const productId = 'product-2';
    const maxThres = 10;
    const currentQty = 12;
    const event = new ProductCriticalMaxThresEvent(new ProductId(productId), new Quantity(maxThres), new Quantity(currentQty));

    await eventHandler.handleProductCriticalMaxThresEvent(event);

    expect(criticalEventPublisherMock.publishCriticalMaxThresEvent).toHaveBeenCalledWith(
      productId,
      maxThres,
      currentQty,
    );
  });
});