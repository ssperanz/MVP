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
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { ProductEventCloudPublisherNats } from './product-event-cloud.publisher.nats.js';
import { ProductCreatedEvent } from 'src/core/domain/product/events/product-created.event.js';

describe('ProductEventCloudPublisherNats', () => {
  let productEventCloudPublisherNats: ProductEventCloudPublisherNats;
  let natsClientMock: ClientProxy;

  beforeEach(() => {
    natsClientMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: jest.fn().mockResolvedValue(undefined),
      }),
    } as unknown as ClientProxy;

    productEventCloudPublisherNats = new ProductEventCloudPublisherNats(natsClientMock);
  });

  it('should publish product created event with correct subject and payload', async () => {
    const event = new ProductCreatedEvent(new ProductId('prod123'), 'Product A', new Money(19.99), new Quantity(100), new Quantity(0), new Quantity(10), new Quantity(200));
    await productEventCloudPublisherNats.publishProductCreated(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.created`,
      {
        productId: event.productId.id,
        name: event.name,
        unitPrice: event.unitPrice.getAmount(),
        availableQty: event.availableQty.getValue,
        reservedQty: event.reservedQty.getValue,
        minThres: event.minThres.getValue,
        maxThres: event.maxThres.getValue,
      }
    );
  });

  it('should publish product name updated event with correct subject and payload', async () => {
    const event = new ProductNameUpdatedEvent(new ProductId('prod123'), 'New Product Name');
    await productEventCloudPublisherNats.publishProducNameUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.name.updated`,
      { productId: event.productId, name: event.name }
    );
  });

  it('should publish product available quantity updated event with correct subject and payload', async () => {
    const event = new ProductAvailableQtyUpdatedEvent(new ProductId('prod123'), new Quantity(50));
    await productEventCloudPublisherNats.publishProductAvailableQtyUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.availableQty.updated`,
      { productId: event.productId, availableQty: event.availableQty }
    );
  });

  it('should publish product price updated event with correct subject and payload', async () => {
    const event = new ProductPriceUpdatedEvent(new ProductId('prod123'), new Money(19.99));
    await productEventCloudPublisherNats.publishProductPriceUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.price.updated`,
      { productId: event.productId, price: event.unitPrice }
    );
  });

  it('should publish product dispatched event with correct subject and payload', async () => {
    const event = new ProductDispatchedEvent(new OrderId('order123'), new ProductId('prod123'), new Quantity(5));
    await productEventCloudPublisherNats.publishProductDispatched(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.dispatched`,
      { productId: event.productId, dispatchedQty: event.qtyDispatched }
    );
  });

  it('should publish product received event with correct subject and payload', async () => {
    const event = new ProductReceivedEvent(new OrderId('order123'), new ProductId('prod123'), new Quantity(5));
    await productEventCloudPublisherNats.publishProductReceived(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.received`,
      { productId: event.productId, receivedQty: event.qtyReceived }
    );
  });

  it('should publish product min threshold updated event with correct subject and payload', async () => {
    const event = new ProductMinThresUpdatedEvent(new ProductId('prod123'), new Quantity(10));
    await productEventCloudPublisherNats.publishProductMinThresUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.minThres.updated`,
      { productId: event.productId, minThres: event.minThres }
    );
  });

  it('should publish product max threshold updated event with correct subject and payload', async () => {
    const event = new ProductMaxThresUpdatedEvent(new ProductId('prod123'), new Quantity(100));
    await productEventCloudPublisherNats.publishProductMaxThresUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.maxThres.updated`,
      { productId: event.productId, maxThres: event.maxThres }
    );
  });

  it('should publish product reserved event with correct subject and payload', async () => {
    const event = new ProductReservedEvent(new OrderId('order123'), new ProductId('prod123'), new Quantity(5));
    await productEventCloudPublisherNats.publishProductReserved(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.reserved`,
      { productId: event.productId, reservedQty: event.qtyReserved }
    );
  });

  it('should publish product released event with correct subject and payload', async () => {
    const event = new ProductReleasedEvent(new OrderId('order123'), new ProductId('prod123'), new Quantity(5));
    await productEventCloudPublisherNats.publishProductReleased(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.released`,
      { productId: event.productId, releasedQty: event.qtyReleased }
    );
  });

  it('should publish product removed event with correct subject and payload', async () => {
    const event = new ProductRemovedEvent(new ProductId('prod123'));
    await productEventCloudPublisherNats.publishProductRemoved(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${process.env.WH_ID || '0'}.product.removed`,
      { productId: event.productId }
    );
  });
});