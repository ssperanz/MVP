import { Product } from './product.entity';
import { ProductId } from '../../../../shared/domain/value-objects/product-id.vo';
import { Quantity } from '../../../../shared/domain/value-objects/quantity.vo';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo';
import { ProductCreatedEvent } from '../events/product-created.event';
import { ProductNameUpdatedEvent } from '../events/product-name-updated.event';
import { ProductPriceUpdatedEvent } from '../events/product-price-updated.event';
import { ProductAvailableQtyUpdatedEvent } from '../events/product-available-qty-updated.event';
import { ProductReservedQtyUpdatedEvent } from '../events/product-reserved-qty-updated.event';
import { ProductMinThresUpdatedEvent } from '../events/product-min-thres-updated.event';
import { ProductMaxThresUpdatedEvent } from '../events/product-max-thres-updated.event';
import { ProductReservedEvent } from '../events/product-reserved.event';
import { ProductReleasedEvent } from '../events/product-released.event';
import { ProductDispatchedEvent } from '../events/product-dispatched.event';
import { ProductReceivedEvent } from '../events/product-received.event';
import { ProductCriticalMinThresEvent } from '../events/product-critical-min-thres.event';
import { ProductCriticalMaxThresEvent } from '../events/product-critical-max-thres.event';
import { ProductRemovedEvent } from '../events/product-removed.event';

describe('Product Entity', () => {
  let productId: ProductId;
  let orderId: OrderId;
  let initialPrice: Money;
  let initialQty: Quantity;
  let minThres: Quantity;
  let maxThres: Quantity;

  beforeEach(() => {
    productId = new ProductId('prod-123');
    orderId = new OrderId('order-456');
    initialPrice = new Money(100);
    initialQty = new Quantity(50);
    minThres = new Quantity(10);
    maxThres = new Quantity(100);
  });

  describe('CREATE', () => {
    it('should create product correctly with initial values', () => {
      const product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);

      expect(product.getId()).toEqual(productId);
      expect(product.getName()).toBe('Test Product');
      expect(product.getUnitPrice()).toEqual(initialPrice);
      expect(product.getAvailableQty()).toEqual(initialQty);
      expect(product.getReservedQty()).toEqual(new Quantity(0));
      expect(product.getMinThres()).toEqual(minThres);
      expect(product.getMaxThres()).toEqual(maxThres);
    });

    it('should emit ProductCreatedEvent on creation', () => {
      const product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      const events = product.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProductCreatedEvent);
    });
  });

  describe('BASIC UPDATES', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
    });

    it('should update product name', () => {
      const newName = 'Updated Product';
      const result = product.updateName(newName);

      expect(product.getName()).toBe(newName);
      expect(result).toBe(newName);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductNameUpdatedEvent));
      
    });

    it('should update unit price', () => {
      const newPrice = new Money(150);
      const result = product.updateUnitPrice(newPrice);

      expect(product.getUnitPrice()).toEqual(newPrice);
      expect(result).toEqual(newPrice);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductPriceUpdatedEvent));
    });

    it('should update available quantity', () => {
      const newQty = new Quantity(75);
      const result = product.updateAvailableQty(newQty);

      expect(product.getAvailableQty()).toEqual(newQty);
      expect(result).toEqual(newQty);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductAvailableQtyUpdatedEvent));
    });

    it('should update reserved quantity', () => {
      const newReservedQty = new Quantity(15);
      const result = product.updateReservedQty(newReservedQty);

      expect(product.getReservedQty()).toEqual(newReservedQty);
      expect(result).toEqual(newReservedQty);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductReservedQtyUpdatedEvent));
    });

    it('should update minimum threshold', () => {
      const newMinThres = new Quantity(20);
      const result = product.updateMinThres(newMinThres);

      expect(product.getMinThres()).toEqual(newMinThres);
      expect(result).toEqual(newMinThres);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductMinThresUpdatedEvent));
    });

    it('should update maximum threshold', () => {
      const newMaxThres = new Quantity(150);
      const result = product.updateMaxThres(newMaxThres);

      expect(product.getMaxThres()).toEqual(newMaxThres);
      expect(result).toEqual(newMaxThres);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductMaxThresUpdatedEvent));
    });
  });

  describe('RESERVATION', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
    });

    it('should reserve available quantity', () => {
      const qtyToReserve = new Quantity(20);
      const result = product.reserve(orderId, qtyToReserve);

      expect(result).toEqual(qtyToReserve);
      expect(product.getAvailableQty()).toEqual(new Quantity(30));
      expect(product.getReservedQty()).toEqual(qtyToReserve);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductReservedEvent));
    });

    it('should reserve partial quantity when requested is greater than available', () => {
      const qtyToReserve = new Quantity(60);
      const result = product.reserve(orderId, qtyToReserve);

      expect(result).toEqual(initialQty);
      expect(product.getAvailableQty()).toEqual(new Quantity(0));
      expect(product.getReservedQty()).toEqual(initialQty);
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductReservedEvent));
    });

    it('should emit ProductReservedEvent', () => {
      const qtyToReserve = new Quantity(25);
      product.reserve(orderId, qtyToReserve);
      const events = product.getUncommittedEvents();

      expect(events).toContainEqual(expect.any(ProductReservedEvent));
    });
  });

  describe('RELEASE', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
      product.reserve(orderId, new Quantity(30));
      product.commit();
    });

    it('should release reserved quantity', () => {
      const qtyToRelease = new Quantity(15);
      const result = product.release(orderId, qtyToRelease);

      expect(product.getReservedQty()).toEqual(new Quantity(15));
      expect(product.getAvailableQty()).toEqual(new Quantity(35));
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductReleasedEvent));
    });

    it('should throw error when releasing more than reserved', () => {
      const qtyToRelease = new Quantity(50);

      expect(() => product.release(orderId, qtyToRelease)).toThrow('Not enough reserved quantity to release');
    });

    it('should emit ProductReleasedEvent', () => {
      product.release(orderId, new Quantity(10));
      const events = product.getUncommittedEvents();

      expect(events).toContainEqual(expect.any(ProductReleasedEvent));
    });
  });

  describe('DISPATCH', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
      product.reserve(orderId, new Quantity(30));
      product.commit();
    });

    it('should dispatch reserved quantity', () => {
      const qtyToDispatch = new Quantity(20);
      const result = product.dispatch(orderId, qtyToDispatch);

      expect(product.getReservedQty()).toEqual(new Quantity(10));
      expect(result).toEqual(new Quantity(10));
      expect(product.getUncommittedEvents()).toContainEqual(expect.any(ProductDispatchedEvent));
    });

    it('should throw error when dispatching more than reserved', () => {
      const qtyToDispatch = new Quantity(50);

      expect(() => product.dispatch(orderId, qtyToDispatch)).toThrow('Not enough reserved quantity to dispatch');
    });

    it('should emit ProductDispatchedEvent', () => {
      product.dispatch(orderId, new Quantity(15));
      const events = product.getUncommittedEvents();

      expect(events).toContainEqual(expect.any(ProductDispatchedEvent));
    });
  });

  describe('RECEIVE', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
    });

    it('should increment available quantity', () => {
      const qtyToReceive = new Quantity(25);
      const result = product.receive(orderId, qtyToReceive);

      expect(product.getAvailableQty()).toEqual(new Quantity(75));
      expect(result).toEqual(new Quantity(75));
    });

    it('should emit ProductReceivedEvent', () => {
      product.receive(orderId, new Quantity(20));
      const events = product.getUncommittedEvents();

      expect(events).toContainEqual(expect.any(ProductReceivedEvent));
    });
  });

  describe('THRESHOLDS', () => {
    it('should emit ProductCriticalMinThresEvent when available qty goes below minimum', () => {
      const product = Product.create(productId, 'Test Product', initialPrice, new Quantity(20), minThres, maxThres);
      product.commit();
      product.updateAvailableQty(new Quantity(5));

      const events = product.getUncommittedEvents();
      expect(events).toContainEqual(expect.any(ProductCriticalMinThresEvent));
    });

    it('should emit ProductCriticalMaxThresEvent when available qty exceeds maximum', () => {
      const product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
      product.updateAvailableQty(new Quantity(150));

      const events = product.getUncommittedEvents();
      expect(events).toContainEqual(expect.any(ProductCriticalMaxThresEvent));
    });

    it('should emit critical threshold event on reserve when qty falls below minimum', () => {
      const product = Product.create(productId, 'Test Product', initialPrice, new Quantity(15), minThres, maxThres);
      product.commit();
      product.reserve(orderId, new Quantity(10));

      const events = product.getUncommittedEvents();
      expect(events).toContainEqual(expect.any(ProductCriticalMinThresEvent));
    });
  });

  describe('TOTAL QUANTITY', () => {
    it('should calculate total quantity as sum of available and reserved', () => {
      const product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
      product.reserve(orderId, new Quantity(20));

      const total = product.getTotalQty();
      expect(total).toEqual(new Quantity(50));
    });
  });

  describe('DELETE', () => {
    it('should delete product and emit ProductRemovedEvent', () => {
      const product = Product.create(productId, 'Test Product', initialPrice, initialQty, minThres, maxThres);
      product.commit();
      product.delete();

      const events = product.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(ProductRemovedEvent);
    });
  });
});
