import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ProductEventCloudPublisher } from '../../../core/application/product/ports/product-event-cloud-publisher.port.js';
import { ClientProxy } from '@nestjs/microservices';
import { ProductNameUpdatedEvent } from 'src/core/domain/product/events/product-name-updated.event.js';
import { ProductAvailableQtyUpdatedEvent } from 'src/core/domain/product/events/product-available-qty-updated.event.js';
import { ProductDispatchedEvent } from 'src/core/domain/product/events/product-dispatched.event.js';
import { ProductPriceUpdatedEvent } from 'src/core/domain/product/events/product-price-updated.event.js';
import { ProductReservedQtyUpdatedEvent } from 'src/core/domain/product/events/product-reserved-qty-updated.event.js';
import { ProductReceivedEvent } from 'src/core/domain/product/events/product-received.event.js';
import { ProductMinThresUpdatedEvent } from 'src/core/domain/product/events/product-min-thres-updated.event.js';
import { ProductMaxThresUpdatedEvent } from 'src/core/domain/product/events/product-max-thres-updated.event.js';
import { ProductReservedEvent } from 'src/core/domain/product/events/product-reserved.event.js';
import { ProductReleasedEvent } from 'src/core/domain/product/events/product-released.event.js';
import { ProductRemovedEvent } from 'src/core/domain/product/events/product-removed.event.js';
import { ProductCreatedEvent } from 'src/core/domain/product/events/product-created.event.js';

@Injectable()
export class ProductEventCloudPublisherNats implements ProductEventCloudPublisher {
  private readonly logger = new Logger(ProductEventCloudPublisherNats.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientProxy) {}

  async publishProductCreated(event: ProductCreatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.created`;
    const payload = {
      productId: event.productId.id,
      name: event.name,
      unitPrice: event.unitPrice.getAmount,
      availableQty: event.availableQty.getValue,
      reservedQty: event.reservedQty.getValue,
      minThres: event.minThres.getValue,
      maxThres: event.maxThres.getValue,
    };

    this.natsClient.emit(subject, payload);
  }

  async publishProducNameUpdate(event: ProductNameUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.name.updated`;
    this.logger.log(`Publishing product.name.updated to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      newName: event.name,
    });
  }

  async publishProductAvailableQtyUpdate(event: ProductAvailableQtyUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.availableQty.updated`;
    this.logger.log(`Publishing product.availableQty.updated to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      newAvailableQty: event.availableQty,
    });
  }

  async publishProductPriceUpdate(event: ProductPriceUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.price.updated`;
    this.logger.log(`Publishing product.price.updated to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      newPrice: event.unitPrice,
    });
  }

  async publishProductReservedQtyUpdate(event: ProductReservedQtyUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.reservedQty.updated`;
    this.logger.log(`Publishing product.reservedQty.updated to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      newReservedQty: event.reservedQty,
    });
  }

  async publishProductDispatched(event: ProductDispatchedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.dispatched`;
    this.logger.log(`Publishing product.dispatched to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      dispatchedQty: event.qtyDispatched,
    });
  }

  async publishProductReceived(event: ProductReceivedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.received`;
    this.logger.log(`Publishing product.received to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      receivedQty: event.qtyReceived,
    });
  }

  async publishProductMinThresUpdate(event: ProductMinThresUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.minThres.updated`;
    this.logger.log(`Publishing product.minThres.updated to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      newMinThres: event.minThres,
    });
  }

  async publishProductMaxThresUpdate(event: ProductMaxThresUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.maxThres.updated`;
    this.logger.log(`Publishing product.maxThres.updated to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      newMaxThres: event.maxThres,
    });
  }

  async publishProductReserved(event: ProductReservedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.reserved`;
    this.logger.log(`Publishing product.reserved to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      reservedQty: event.qtyReserved,
    });
  }

  async publishProductReleased(event: ProductReleasedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.released`;
    this.logger.log(`Publishing product.released to NATS cloud for product ID: ${event.productId}`);
    this.natsClient.emit(subject, {
      productId: event.productId,
      releasedQty: event.qtyReleased,
    });
  }

  async publishProductRemoved(event: ProductRemovedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WH_ID || '0'}.product.removed`;
    this.logger.log(`Publishing product.removed to NATS cloud`);
    this.natsClient.emit(subject, {
      productId: event.productId,
    });
  }
}
