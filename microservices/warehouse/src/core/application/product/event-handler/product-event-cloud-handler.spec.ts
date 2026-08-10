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
import { ProductEventCloudHandler } from './product-event-cloud-handler.js';

describe('ProductEventCloudHandler', () => {
  let productEventCloudPublisherMock: ProductEventCloudPublisher;
  let productEventCloudHandler: ProductEventCloudHandler;

  beforeEach(() => {
    productEventCloudPublisherMock = {
      publishProductCreated: jest.fn(),
      publishProductRemoved: jest.fn(),
      publishProducNameUpdate: jest.fn(),
      publishProductPriceUpdate: jest.fn(),
      publishProductAvailableQtyUpdate: jest.fn(),
      publishProductReservedQtyUpdate: jest.fn(),
      publishProductMinThresUpdate: jest.fn(),
      publishProductMaxThresUpdate: jest.fn(),
      publishProductReserved: jest.fn(),
      publishProductReleased: jest.fn(),
      publishProductDispatched: jest.fn(),
      publishProductReceived: jest.fn(),
    };

    productEventCloudHandler = new ProductEventCloudHandler(productEventCloudPublisherMock);
  });

  it('should call the appropriate publisher method for ProductCreatedEvent', async () => {
    const productCreatedEventMock = jest.fn() as unknown as ProductCreatedEvent;
    await productEventCloudHandler.onProductCreated(productCreatedEventMock);
    expect(productEventCloudPublisherMock.publishProductCreated).toHaveBeenCalledWith(productCreatedEventMock);
  });

  it('should call the appropriate publisher method for ProductRemovedEvent', async () => {
    const productRemovedEventMock = jest.fn() as unknown as ProductRemovedEvent;
    await productEventCloudHandler.onProductRemoved(productRemovedEventMock);
    expect(productEventCloudPublisherMock.publishProductRemoved).toHaveBeenCalledWith(productRemovedEventMock);
  });

  it('should call the appropriate publisher method for ProductNameUpdatedEvent', async () => {
    const productNameUpdatedEventMock = jest.fn() as unknown as ProductNameUpdatedEvent;
    await productEventCloudHandler.onNameUpdated(productNameUpdatedEventMock);
    expect(productEventCloudPublisherMock.publishProducNameUpdate).toHaveBeenCalledWith(productNameUpdatedEventMock);
  });

  it('should call the appropriate publisher method for ProductPriceUpdatedEvent', async () => {
    const productPriceUpdatedEventMock = jest.fn() as unknown as ProductPriceUpdatedEvent;
    await productEventCloudHandler.onPriceUpdated(productPriceUpdatedEventMock);
    expect(productEventCloudPublisherMock.publishProductPriceUpdate).toHaveBeenCalledWith(productPriceUpdatedEventMock);
  });

  it('should call the appropriate publisher method for ProductAvailableQtyUpdatedEvent', async () => {
    const productAvailableQtyUpdatedEventMock = jest.fn() as unknown as ProductAvailableQtyUpdatedEvent;
    await productEventCloudHandler.onAvailableQtyUpdated(productAvailableQtyUpdatedEventMock);
    expect(productEventCloudPublisherMock.publishProductAvailableQtyUpdate).toHaveBeenCalledWith(productAvailableQtyUpdatedEventMock);
  });

  it('should call the appropriate publisher method for ProductReservedQtyUpdatedEvent', async () => {
    const productReservedQtyUpdatedEventMock = jest.fn() as unknown as ProductReservedQtyUpdatedEvent;
    await productEventCloudHandler.onReservedQtyUpdated(productReservedQtyUpdatedEventMock);
    expect(productEventCloudPublisherMock.publishProductReservedQtyUpdate).toHaveBeenCalledWith(productReservedQtyUpdatedEventMock);
  });

  it('should call the appropriate publisher method for ProductMinThresUpdatedEvent', async () => {
    const productMinThresUpdatedEventMock = jest.fn() as unknown as ProductMinThresUpdatedEvent;
    await productEventCloudHandler.onMinThresUpdated(productMinThresUpdatedEventMock);
    expect(productEventCloudPublisherMock.publishProductMinThresUpdate).toHaveBeenCalledWith(productMinThresUpdatedEventMock);
  });

  it('should call the appropriate publisher method for ProductMaxThresUpdatedEvent', async () => {
    const productMaxThresUpdatedEventMock = jest.fn() as unknown as ProductMaxThresUpdatedEvent;
    await productEventCloudHandler.onMaxThresUpdated(productMaxThresUpdatedEventMock);
    expect(productEventCloudPublisherMock.publishProductMaxThresUpdate).toHaveBeenCalledWith(productMaxThresUpdatedEventMock);
  });

  it('should call the appropriate publisher method for ProductReservedEvent', async () => {
    const productReservedEventMock = jest.fn() as unknown as ProductReservedEvent;
    await productEventCloudHandler.onProductReserved(productReservedEventMock);
    expect(productEventCloudPublisherMock.publishProductReserved).toHaveBeenCalledWith(productReservedEventMock);
  });

  it('should call the appropriate publisher method for ProductReleasedEvent', async () => {
    const productReleasedEventMock = jest.fn() as unknown as ProductReleasedEvent;
    await productEventCloudHandler.onProductReleased(productReleasedEventMock);
    expect(productEventCloudPublisherMock.publishProductReleased).toHaveBeenCalledWith(productReleasedEventMock);
  });

  it('should call the appropriate publisher method for ProductDispatchedEvent', async () => {
    const productDispatchedEventMock = jest.fn() as unknown as ProductDispatchedEvent;
    await productEventCloudHandler.onProductDispatched(productDispatchedEventMock);
    expect(productEventCloudPublisherMock.publishProductDispatched).toHaveBeenCalledWith(productDispatchedEventMock);
  });

  it('should call the appropriate publisher method for ProductReceivedEvent', async () => {
    const productReceivedEventMock = jest.fn() as unknown as ProductReceivedEvent;
    await productEventCloudHandler.onProductReceived(productReceivedEventMock);
    expect(productEventCloudPublisherMock.publishProductReceived).toHaveBeenCalledWith(productReceivedEventMock);
  });

});