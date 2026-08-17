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
  let productReadModelMock: jest.Mocked<ProductReadModelRepository>;
  let productReadModelUpdater: ProductReadModelUpdater;

  const existingProduct = () => ({
    productId: 'product-1',
    name: 'Product Name',
    unitPrice: 100,
    availableQty: 10,
    reservedQty: 5,
    minThres: 0,
    maxThres: 20,
  });

  beforeEach(() => {
    productReadModelMock = {
      upsert: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProductReadModelRepository>;

    productReadModelUpdater = new ProductReadModelUpdater(
      productReadModelMock,
    );
  });

  it('should delete the read model on ProductRemovedEvent', async () => {
    const event = new ProductRemovedEvent(
      new ProductId('product-1'),
    );

    await productReadModelUpdater.onProductRemoved(event);

    expect(productReadModelMock.delete).toHaveBeenCalledWith('product-1');
  });

  it('should create the read model on ProductCreatedEvent', async () => {
    const event = new ProductCreatedEvent(
      new ProductId('product-1'),
      'Product Name',
      new Money(100),
      new Quantity(10),
      new Quantity(5),
      new Quantity(0),
      new Quantity(20),
    );

    await productReadModelUpdater.onProductCreated(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      productId: 'product-1',
      name: 'Product Name',
      unitPrice: 100,
      availableQty: 10,
      reservedQty: 5,
      minThres: 0,
      maxThres: 20,
    });
  });

  it('should update the read model on ProductNameUpdatedEvent', async () => {
    const event = new ProductNameUpdatedEvent(
      new ProductId('product-1'),
      'Updated Name',
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onNameUpdated(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      name: 'Updated Name',
    });
  });

  it('should update the read model on ProductPriceUpdatedEvent', async () => {
    const event = new ProductPriceUpdatedEvent(
      new ProductId('product-1'),
      new Money(150),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onPriceUpdated(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      unitPrice: 150,
    });
  });

  it('should update the read model on ProductAvailableQtyUpdatedEvent', async () => {
    const event = new ProductAvailableQtyUpdatedEvent(
      new ProductId('product-1'),
      new Quantity(20),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onAvailableQtyUpdated(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      availableQty: 20,
    });
  });

  it('should update the read model on ProductReservedQtyUpdatedEvent', async () => {
    const event = new ProductReservedQtyUpdatedEvent(
      new ProductId('product-1'),
      new Quantity(15),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onReservedQtyUpdated(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      reservedQty: 15,
    });
  });

  it('should update the read model on ProductMinThresUpdatedEvent', async () => {
    const event = new ProductMinThresUpdatedEvent(
      new ProductId('product-1'),
      new Quantity(5),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onMinThresUpdated(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      minThres: 5,
    });
  });

  it('should update the read model on ProductMaxThresUpdatedEvent', async () => {
    const event = new ProductMaxThresUpdatedEvent(
      new ProductId('product-1'),
      new Quantity(25),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onMaxThresUpdated(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      maxThres: 25,
    });
  });

  it('should update the read model on ProductReservedEvent', async () => {
    const event = new ProductReservedEvent(
      new OrderId('order-1'),
      new ProductId('product-1'),
      new Quantity(3),
      new Quantity(7),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onProductReserved(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      availableQty: event.updatedAvailableQty.getValue,
      reservedQty: event.updatedReservedQty.getValue,
    });
  });

  it('should update the read model on ProductReleasedEvent', async () => {
    const event = new ProductReleasedEvent(
      new OrderId('order-1'),
      new ProductId('product-1'),
      new Quantity(2),
      new Quantity(5),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onProductReleased(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      availableQty: event.updatedAvailableQty.getValue,
      reservedQty: event.updatedReservedQty.getValue,
    });
  });

  it('should update the read model on ProductDispatchedEvent', async () => {
    const event = new ProductDispatchedEvent(
      new OrderId('order-1'),
      new ProductId('product-1'),
      new Quantity(4),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onProductDispatched(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      reservedQty: event.updatedReservedQty.getValue,
    });
  });

  it('should update the read model on ProductReceivedEvent', async () => {
    const event = new ProductReceivedEvent(
      new OrderId('order-1'),
      new ProductId('product-1'),
      new Quantity(6),
    );

    productReadModelMock.findById.mockResolvedValue(existingProduct());

    await productReadModelUpdater.onProductReceived(event);

    expect(productReadModelMock.upsert).toHaveBeenCalledWith({
      ...existingProduct(),
      availableQty: event.updatedAvailableQty.getValue,
    });
  });
});