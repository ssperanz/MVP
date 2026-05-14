import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AbstractProductEventHandler } from './abstract-product-event-handler.js';
import type { ProductEventCloudPublisher } from '../ports/product-event-cloud-publisher.port.js';
import { ProductCreatedEvent } from '../../../domain/product/events/product-created.event.js';
import { ProductRemovedEvent } from '../../../domain/product/events/product-removed.event.js';
import { ProductNameUpdatedEvent } from '../../../domain/product/events/product-name-updated.event.js';
import { ProductPriceUpdatedEvent } from '../../../domain/product/events/product-price-updated.event.js';
import { ProductAvailableQtyUpdatedEvent } from '../../../domain/product/events/product-available-qty-updated.event.js';
import { ProductReservedQtyUpdatedEvent } from '../../../domain/product/events/product-reserved-qty-updated.event.js';
import { ProductMinThresUpdatedEvent } from '../../../domain/product/events/product-min-thres-updated.event.js';
import { ProductMaxThresUpdatedEvent } from '../../../domain/product/events/product-max-thres-updated.event.js';
import { ProductReservedEvent } from '../../../domain/product/events/product-reserved.event.js';
import { ProductReleasedEvent } from '../../../domain/product/events/product-released.event.js';
import { ProductDispatchedEvent } from '../../../domain/product/events/product-dispatched.event.js';
import { ProductReceivedEvent } from '../../../domain/product/events/product-received.event.js';
import { ProductEvent } from 'src/shared/domain/events/product-event.base.js';

@EventsHandler(
  ProductCreatedEvent, ProductRemovedEvent,
  ProductNameUpdatedEvent, ProductPriceUpdatedEvent,
  ProductAvailableQtyUpdatedEvent, ProductReservedQtyUpdatedEvent,
  ProductMinThresUpdatedEvent, ProductMaxThresUpdatedEvent,
  ProductReservedEvent, ProductReleasedEvent,
  ProductDispatchedEvent, ProductReceivedEvent,
)
export class ProductEventCloudHandler extends AbstractProductEventHandler implements IEventHandler<ProductEvent> {
  constructor(
    @Inject('IProductEventCloudPublisher')
    private readonly publisher: ProductEventCloudPublisher,
  ) {
    super();
  }

  override async onProductCreated(event: ProductCreatedEvent): Promise<void> {
    await this.publisher.publishProductCreated(event);
  }

  override async onProductRemoved(event: ProductRemovedEvent): Promise<void> {
    await this.publisher.publishProductRemoved(event);
  }

  override async onNameUpdated(event: ProductNameUpdatedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onPriceUpdated(event: ProductPriceUpdatedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onAvailableQtyUpdated(event: ProductAvailableQtyUpdatedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onReservedQtyUpdated(event: ProductReservedQtyUpdatedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onMinThresUpdated(event: ProductMinThresUpdatedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onMaxThresUpdated(event: ProductMaxThresUpdatedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onProductReserved(event: ProductReservedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onProductReleased(event: ProductReleasedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onProductDispatched(event: ProductDispatchedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }

  override async onProductReceived(event: ProductReceivedEvent): Promise<void> {
    await this.publisher.publishProductUpdated(event);
  }
}
