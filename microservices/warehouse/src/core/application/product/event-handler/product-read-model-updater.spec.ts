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
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';
import { ProductReadModelUpdater } from './product-read-model-updater.js';

describe('ProductReadModelUpdater', () => {
  let productReadModelMock: ProductReadModelRepository;
  let productReadModelUpdater: ProductReadModelUpdater;

  beforeEach(() => {
    productReadModelMock = {
      upsert: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as unknown as ProductReadModelRepository;

    productReadModelUpdater = new ProductReadModelUpdater(productReadModelMock);
  });

  it('should update the read model on ProductRemovedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductRemovedEvent(new ProductId(productId));
    await productReadModelUpdater.onProductRemoved(event);
    expect(productReadModelMock.delete).toHaveBeenCalledWith(productId);
  });

  it('should update the read model on ProductCreatedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductCreatedEvent(
      new ProductId(productId),
      'Product Name',
      new Money(100),
      new Quantity(10),
      new Quantity(5),
      new Quantity(0),
      new Quantity(20),
    );
    await productReadModelUpdater.onProductCreated(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });

  });
  
  it('should update the read model on ProductNameUpdatedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductNameUpdatedEvent(new ProductId(productId), 'Updated Name');
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Old Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onNameUpdated(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Updated Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductPriceUpdatedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductPriceUpdatedEvent(new ProductId(productId), new Money(150));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onPriceUpdated(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 150,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductAvailableQtyUpdatedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductAvailableQtyUpdatedEvent(new ProductId(productId), new Quantity(20));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onAvailableQtyUpdated(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 20,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductReservedQtyUpdatedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductReservedQtyUpdatedEvent(new ProductId(productId), new Quantity(15));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onReservedQtyUpdated(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 15,
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductMinThresUpdatedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductMinThresUpdatedEvent(new ProductId(productId), new Quantity(5));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onMinThresUpdated(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 5,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductMaxThresUpdatedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductMaxThresUpdatedEvent(new ProductId(productId), new Quantity(25));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onMaxThresUpdated(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 25,
    });
  });

  it('should update the read model on ProductReservedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductReservedEvent(new OrderId('order-1'), new ProductId(productId), new Quantity(3));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onProductReserved(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 7, 
      reservedQty: 8,
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductReleasedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductReleasedEvent(new OrderId('order-1'), new ProductId(productId), new Quantity(2));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onProductReleased(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 12, 
      reservedQty: 3, 
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductDispatchedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductDispatchedEvent(new OrderId('order-1'), new ProductId(productId), new Quantity(4));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onProductDispatched(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10, 
      reservedQty: 1, 
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductReceivedEvent', async () => {
    const productId = 'product-1';
    const event = new ProductReceivedEvent(new OrderId('order-1'), new ProductId(productId), new Quantity(6));
    (productReadModelMock.findById as jest.Mock).mockResolvedValue({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
    await productReadModelUpdater.onProductReceived(event);
    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: productId,
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 16, 
      reservedQty: 5, 
      minThres: 0,
      maxThres: 20,
    });
  });

});