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

import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';

import { ProductEventCloudPublisherNats } from './product-event-cloud.publisher.nats.js';

describe('ProductEventCloudPublisherNats', () => {
  let productEventCloudPublisherNats: ProductEventCloudPublisherNats;
  let natsClientMock: jest.Mocked<ClientProxy>;

  const warehouseId = process.env.WAREHOUSE_ID || '0';

  beforeEach(() => {
    natsClientMock = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<ClientProxy>;

    productEventCloudPublisherNats =
      new ProductEventCloudPublisherNats(natsClientMock);
  });

  it('should publish product created event with correct subject and payload', async () => {
    const event = new ProductCreatedEvent(
      new ProductId('prod123'),
      'Product A',
      new Money(19.99),
      new Quantity(100),
      new Quantity(0),
      new Quantity(10),
      new Quantity(200),
    );

    await productEventCloudPublisherNats.publishProductCreated(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.created`,
      {
        productId: 'prod123',
        name: 'Product A',
        unitPrice: 19.99,
        availableQty: 100,
        reservedQty: 0,
        minThres: 10,
        maxThres: 200,
      },
    );
  });

  it('should publish product name updated event with correct subject and payload', async () => {
    const event = new ProductNameUpdatedEvent(
      new ProductId('prod123'),
      'New Product Name',
    );

    await productEventCloudPublisherNats.publishProducNameUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        name: 'New Product Name',
      },
    );
  });

  it('should publish product available quantity updated event with correct subject and payload', async () => {
    const event = new ProductAvailableQtyUpdatedEvent(
      new ProductId('prod123'),
      new Quantity(50),
    );

    await productEventCloudPublisherNats.publishProductAvailableQtyUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        availableQty: 50,
      },
    );
  });

  it('should publish product price updated event with correct subject and payload', async () => {
    const event = new ProductPriceUpdatedEvent(
      new ProductId('prod123'),
      new Money(19.99),
    );

    await productEventCloudPublisherNats.publishProductPriceUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        price: 19.99,
      },
    );
  });

  it('should publish product reserved quantity updated event with correct subject and payload', async () => {
    const event = new ProductReservedQtyUpdatedEvent(
      new ProductId('prod123'),
      new Quantity(25),
    );

    await productEventCloudPublisherNats.publishProductReservedQtyUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        reservedQty: 25,
      },
    );
  });

  it('should publish product dispatched event with correct subject and payload', async () => {
    const event = new ProductDispatchedEvent(
      new OrderId('order123'),
      new ProductId('prod123'),
      new Quantity(5),
    );

    // Il publisher usa i valori aggiornati contenuti nell'evento.
    // Questo test assume che l'evento sia costruito con i valori corretti.
    await productEventCloudPublisherNats.publishProductDispatched(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        reservedQty: event.updatedReservedQty.getValue,
      },
    );
  });

  it('should publish product received event with correct subject and payload', async () => {
    const event = new ProductReceivedEvent(
      new OrderId('order123'),
      new ProductId('prod123'),
      new Quantity(5),
    );

    await productEventCloudPublisherNats.publishProductReceived(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        availableQty: event.updatedAvailableQty.getValue,
      },
    );
  });

  it('should publish product min threshold updated event with correct subject and payload', async () => {
    const event = new ProductMinThresUpdatedEvent(
      new ProductId('prod123'),
      new Quantity(10),
    );

    await productEventCloudPublisherNats.publishProductMinThresUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        minThres: 10,
      },
    );
  });

  it('should publish product max threshold updated event with correct subject and payload', async () => {
    const event = new ProductMaxThresUpdatedEvent(
      new ProductId('prod123'),
      new Quantity(100),
    );

    await productEventCloudPublisherNats.publishProductMaxThresUpdate(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        maxThres: 100,
      },
    );
  });

  it('should publish product reserved event with correct subject and payload', async () => {
    const event = new ProductReservedEvent(
      new OrderId('order123'),
      new ProductId('prod123'),
      new Quantity(5),
      new Quantity(10),
    );

    await productEventCloudPublisherNats.publishProductReserved(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        availableQty: event.updatedAvailableQty.getValue,
        reservedQty: event.updatedReservedQty.getValue,
      },
    );
  });

  it('should publish product released event with correct subject and payload', async () => {
    const event = new ProductReleasedEvent(
      new OrderId('order123'),
      new ProductId('prod123'),
      new Quantity(5),
      new Quantity(10),
    );

    await productEventCloudPublisherNats.publishProductReleased(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.updated`,
      {
        productId: 'prod123',
        availableQty: event.updatedAvailableQty.getValue,
        reservedQty: event.updatedReservedQty.getValue,
      },
    );
  });

  it('should publish product removed event with correct subject and payload', async () => {
    const event = new ProductRemovedEvent(
      new ProductId('prod123'),
    );

    await productEventCloudPublisherNats.publishProductRemoved(event);

    expect(natsClientMock.emit).toHaveBeenCalledWith(
      `warehouse.${warehouseId}.product.removed`,
      {
        productId: 'prod123',
      },
    );
  });
});