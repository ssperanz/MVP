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
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.created`;
    const payload = {
      productId: event.productId.id,
      name: event.name,
      unitPrice: event.unitPrice.getAmount(),
      availableQty: event.availableQty.getValue,
      reservedQty: event.reservedQty.getValue,
      minThres: event.minThres.getValue,
      maxThres: event.maxThres.getValue,
    };

    this.natsClient.emit(subject, payload);
  }

  async publishProducNameUpdate(event: ProductNameUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      name: event.name,
    });
  }

  async publishProductAvailableQtyUpdate(event: ProductAvailableQtyUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      availableQty: event.availableQty.getValue,
    });
  }

  async publishProductPriceUpdate(event: ProductPriceUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      price: event.unitPrice.getAmount(),
    });
  }

  async publishProductReservedQtyUpdate(event: ProductReservedQtyUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      reservedQty: event.reservedQty.getValue,
    });
  }

  async publishProductDispatched(event: ProductDispatchedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      reservedQty: event.updatedReservedQty.getValue,
    });
  }

  async publishProductReceived(event: ProductReceivedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      availableQty: event.updatedAvailableQty.getValue,
    });
  }

  async publishProductMinThresUpdate(event: ProductMinThresUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      minThres: event.minThres.getValue,
    });
  }

  async publishProductMaxThresUpdate(event: ProductMaxThresUpdatedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      maxThres: event.maxThres.getValue,
    });
  }

  async publishProductReserved(event: ProductReservedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      availableQty: event.updatedAvailableQty.getValue,
      reservedQty: event.updatedReservedQty.getValue,
    });
  }

  async publishProductReleased(event: ProductReleasedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.updated`;
    this.logger.log(`Publishing product.updated to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
      availableQty: event.updatedAvailableQty.getValue,
      reservedQty: event.updatedReservedQty.getValue,
    });
  }

  async publishProductRemoved(event: ProductRemovedEvent): Promise<void> {
    const subject = `warehouse.${process.env.WAREHOUSE_ID || '0'}.product.removed`;
    this.logger.log(`Publishing product.removed to NATS cloud for product ID: ${event.productId.id}`);
    this.natsClient.emit(subject, {
      productId: event.productId.id,
    });
  }
}
