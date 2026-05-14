import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AbstractProductEventHandler } from './abstract-product-event-handler.js';
import type { ProductReadModelRepository } from '../ports/product-read-model.repository.interface.js';
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

@EventsHandler(
  ProductCreatedEvent, ProductRemovedEvent,
  ProductNameUpdatedEvent, ProductPriceUpdatedEvent,
  ProductAvailableQtyUpdatedEvent, ProductReservedQtyUpdatedEvent,
  ProductMinThresUpdatedEvent, ProductMaxThresUpdatedEvent,
  ProductReservedEvent, ProductReleasedEvent,
  ProductDispatchedEvent, ProductReceivedEvent,
)
export class ProductReadModelUpdater extends AbstractProductEventHandler implements IEventHandler<any> {
  constructor(
    @Inject('IProductReadModelRepository')
    private readonly productReadModel: ProductReadModelRepository,
  ) {
    super();
  }

  override async onProductCreated(event: ProductCreatedEvent): Promise<void> {
    await this.productReadModel.upsert({
      productId: event.productId.id,
      name: event.name,
      unitPrice: event.unitPrice.getAmount(),
      availableQty: event.availableQty.getValue,
      reservedQty: event.reservedQty.getValue,
      minThres: event.minThres.getValue,
      maxThres: event.maxThres.getValue,
    });
  }

  override async onProductRemoved(event: ProductRemovedEvent): Promise<void> {
    await this.productReadModel.delete(event.productId.id);
  }

  override async onNameUpdated(event: ProductNameUpdatedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.name = event.name;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onPriceUpdated(event: ProductPriceUpdatedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.unitPrice = event.unitPrice.getAmount();
      await this.productReadModel.upsert(existing);
    }
  }

  override async onAvailableQtyUpdated(event: ProductAvailableQtyUpdatedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.availableQty = event.availableQty.getValue;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onReservedQtyUpdated(event: ProductReservedQtyUpdatedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.reservedQty = event.reservedQty.getValue;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onMinThresUpdated(event: ProductMinThresUpdatedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.minThres = event.minThres.getValue;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onMaxThresUpdated(event: ProductMaxThresUpdatedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.maxThres = event.maxThres.getValue;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onProductReserved(event: ProductReservedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.availableQty -= event.qtyReserved.getValue;
      existing.reservedQty += event.qtyReserved.getValue;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onProductReleased(event: ProductReleasedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.reservedQty -= event.qtyReleased.getValue;
      existing.availableQty += event.qtyReleased.getValue;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onProductDispatched(event: ProductDispatchedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.reservedQty -= event.qtyDispatched.getValue;
      await this.productReadModel.upsert(existing);
    }
  }

  override async onProductReceived(event: ProductReceivedEvent): Promise<void> {
    const existing = await this.productReadModel.findById(event.productId.id);
    if (existing) {
      existing.availableQty += event.qtyReceived.getValue;
      await this.productReadModel.upsert(existing);
    }
  }
}
