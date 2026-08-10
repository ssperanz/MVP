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
import { ProductId } from 'src/shared/domain/value-objects/product-id.vo.js';
import { Money } from 'src/shared/domain/value-objects/money.vo.js';
import { Quantity } from 'src/shared/domain/value-objects/quantity.vo.js';
import { AbstractProductEventHandler } from './abstract-product-event-handler.js';
import { OrderId } from 'src/shared/domain/value-objects/order-id.vo.js';


class TestProductEventHandler extends AbstractProductEventHandler {
  public override onProductCreated = jest.fn();
  public override onProductRemoved = jest.fn();
  public override onNameUpdated = jest.fn();
  public override onPriceUpdated = jest.fn();
  public override onAvailableQtyUpdated = jest.fn();
  public override onReservedQtyUpdated = jest.fn();
  public override onMinThresUpdated = jest.fn();
  public override onMaxThresUpdated = jest.fn();
  public override onProductReserved = jest.fn();
  public override onProductReleased = jest.fn();
  public override onProductDispatched = jest.fn();
  public override onProductReceived = jest.fn();
}

describe('AbstractProductEventHandler', () => {
  let eventHandler: TestProductEventHandler;

  beforeEach(() => {
    eventHandler = new TestProductEventHandler();
  });

  it('should call onProductCreated when ProductCreatedEvent is handled', async () => {
    const event = new ProductCreatedEvent(new ProductId('product-123'), 'Product Name', new Money(10), new Quantity(100), new Quantity(10), new Quantity(0), new Quantity(2000));
    await eventHandler.handle(event);
    expect(eventHandler.onProductCreated).toHaveBeenCalledWith(event);
  });

  it('should call onProductRemoved when ProductRemovedEvent is handled', async () => {
    const event = new ProductRemovedEvent(new ProductId('product-123'));
    await eventHandler.handle(event);
    expect(eventHandler.onProductRemoved).toHaveBeenCalledWith(event);
  });

  it('should call onNameUpdated when ProductNameUpdatedEvent is handled', async () => {
    const event = new ProductNameUpdatedEvent(new ProductId('product-123'), 'New Product Name');
    await eventHandler.handle(event);
    expect(eventHandler.onNameUpdated).toHaveBeenCalledWith(event);
  });

  it('should call onPriceUpdated when ProductPriceUpdatedEvent is handled', async () => {
    const event = new ProductPriceUpdatedEvent(new ProductId('product-123'), new Money(20));
    await eventHandler.handle(event);
    expect(eventHandler.onPriceUpdated).toHaveBeenCalledWith(event);
  });

  it('should call onAvailableQtyUpdated when ProductAvailableQtyUpdatedEvent is handled', async () => {
    const event = new ProductAvailableQtyUpdatedEvent(new ProductId('product-123'), new Quantity(50));
    await eventHandler.handle(event);
    expect(eventHandler.onAvailableQtyUpdated).toHaveBeenCalledWith(event);
  });

  it('should call onReservedQtyUpdated when ProductReservedQtyUpdatedEvent is handled', async () => {
    const event = new ProductReservedQtyUpdatedEvent(new ProductId('product-123'), new Quantity(30));
    await eventHandler.handle(event);
    expect(eventHandler.onReservedQtyUpdated).toHaveBeenCalledWith(event);
  });
  
  it('should call onMinThresUpdated when ProductMinThresUpdatedEvent is handled', async () => {
    const event = new ProductMinThresUpdatedEvent(new ProductId('product-123'), new Quantity(10));
    await eventHandler.handle(event);
    expect(eventHandler.onMinThresUpdated).toHaveBeenCalledWith(event);
  });

  it('should call onMaxThresUpdated when ProductMaxThresUpdatedEvent is handled', async () => {
    const event = new ProductMaxThresUpdatedEvent(new ProductId('product-123'), new Quantity(200));
    await eventHandler.handle(event);
    expect(eventHandler.onMaxThresUpdated).toHaveBeenCalledWith(event);
  });

  it('should call onProductReserved when ProductReservedEvent is handled', async () => {
    const event = new ProductReservedEvent(new OrderId('order-123'), new ProductId('product-123'), new Quantity(20));
    await eventHandler.handle(event);
    expect(eventHandler.onProductReserved).toHaveBeenCalledWith(event);
  });

  it('should call onProductReleased when ProductReleasedEvent is handled', async () => {
    const event = new ProductReleasedEvent(new OrderId('order-123'), new ProductId('product-123'), new Quantity(15));
    await eventHandler.handle(event);
    expect(eventHandler.onProductReleased).toHaveBeenCalledWith(event);
  });

  it('should call onProductDispatched when ProductDispatchedEvent is handled', async () => {
    const event = new ProductDispatchedEvent(new OrderId('order-123'), new ProductId('product-123'), new Quantity(25));
    await eventHandler.handle(event);
    expect(eventHandler.onProductDispatched).toHaveBeenCalledWith(event);
  });

  it('should call onProductReceived when ProductReceivedEvent is handled', async () => {
    const event = new ProductReceivedEvent(new OrderId('order-123'), new ProductId('product-123'), new Quantity(30));
    await eventHandler.handle(event);
    expect(eventHandler.onProductReceived).toHaveBeenCalledWith(event);
  });
});