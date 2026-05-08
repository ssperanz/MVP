import { AggregateRoot } from '@nestjs/cqrs';
import { ProductId } from '../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../../shared/domain/value-objects/money.vo.js';
import { ProductCreatedEvent } from '../events/product-created.event.js';
import { ProductRemovedEvent } from '../events/product-removed.event.js';
import { ProductNameUpdatedEvent } from '../events/product-name-updated.event.js';
import { ProductPriceUpdatedEvent } from '../events/product-price-updated.event.js';
import { ProductAvailableQtyUpdatedEvent } from '../events/product-available-qty-updated.event.js';
import { ProductReservedQtyUpdatedEvent } from '../events/product-reserved-qty-updated.event.js';
import { ProductMinThresUpdatedEvent } from '../events/product-min-thres-updated.event.js';
import { ProductMaxThresUpdatedEvent } from '../events/product-max-thres-updated.event.js';
import { ProductReservedEvent } from '../events/product-reserved.event.js';
import { ProductReleasedEvent } from '../events/product-released.event.js';
import { ProductDispatchedEvent } from '../events/product-dispatched.event.js';
import { ProductReceivedEvent } from '../events/product-received.event.js';

export class Product extends AggregateRoot {
  constructor(
    private readonly productId: ProductId,
    private name: string,
    private unitPrice: Money,
    private availableQty: Quantity,
    private reservedQty: Quantity,
    private minThres: Quantity,
    private maxThres: Quantity,
  ) {
    super();
  }

  static create(
    pid: ProductId,
    name: string,
    price: Money,
    qty: Quantity,
    minThres: Quantity,
    maxThres: Quantity,
  ): Product {
    const product = new Product(pid, name, price, qty, new Quantity(0), minThres, maxThres);
    product.apply(
      new ProductCreatedEvent(
        pid,
        name,
        price,
        qty,
        new Quantity(0),
        minThres,
        maxThres,
      ),
    );
    return product;
  }

  delete(): void {
    this.apply(new ProductRemovedEvent(this.productId));
  }

  getId(): ProductId { return this.productId; }
  getName(): string { return this.name; }
  getUnitPrice(): Money { return this.unitPrice; }
  getAvailableQty(): Quantity { return this.availableQty; }
  getReservedQty(): Quantity { return this.reservedQty; }
  getTotalQty(): Quantity { return this.availableQty.increaseBy(this.reservedQty); }
  getMinThres(): Quantity { return this.minThres; }
  getMaxThres(): Quantity { return this.maxThres; }

  updateName(newName: string): string {
    this.name = newName;
    this.apply(new ProductNameUpdatedEvent(this.productId, newName));
    return this.name;
  }

  updateUnitPrice(newUnitPrice: Money): Money {
    this.unitPrice = newUnitPrice;
    this.apply(new ProductPriceUpdatedEvent(this.productId, newUnitPrice));
    return this.unitPrice;
  }

  updateAvailableQty(newAvail: Quantity): Quantity {
    this.availableQty = newAvail;
    this.apply(new ProductAvailableQtyUpdatedEvent(this.productId, newAvail));
    return this.availableQty;
  }

  updateReservedQty(newReserved: Quantity): Quantity {
    this.reservedQty = newReserved;
    this.apply(new ProductReservedQtyUpdatedEvent(this.productId, newReserved));
    return this.reservedQty;
  }

  updateMinThres(newMinThres: Quantity): Quantity {
    this.minThres = newMinThres;
    this.apply(new ProductMinThresUpdatedEvent(this.productId, newMinThres));
    return this.minThres;
  }

  updateMaxThres(newMaxThres: Quantity): Quantity {
    this.maxThres = newMaxThres;
    this.apply(new ProductMaxThresUpdatedEvent(this.productId, newMaxThres));
    return this.maxThres;
  }

  reserve(qtyToReserve: Quantity): Quantity {
    if (qtyToReserve.isGreaterThan(this.availableQty)) {
      throw new Error('Not enough available quantity to reserve');
    }
    this.availableQty = this.availableQty.decreaseBy(qtyToReserve);
    this.reservedQty = this.reservedQty.increaseBy(qtyToReserve);
    this.apply(new ProductReservedEvent(this.productId, qtyToReserve));
    return this.reservedQty;
  }

  release(qtyToRelease: Quantity): Quantity {
    if (qtyToRelease.isGreaterThan(this.reservedQty)) {
      throw new Error('Not enough reserved quantity to release');
    }
    this.reservedQty = this.reservedQty.decreaseBy(qtyToRelease);
    this.availableQty = this.availableQty.increaseBy(qtyToRelease);
    this.apply(new ProductReleasedEvent(this.productId, qtyToRelease));
    return this.availableQty;
  }

  dispatch(qtyToDispatch: Quantity): Quantity {
    if (qtyToDispatch.isGreaterThan(this.reservedQty)) {
      throw new Error('Not enough reserved quantity to dispatch');
    }
    this.reservedQty = this.reservedQty.decreaseBy(qtyToDispatch);
    this.apply(new ProductDispatchedEvent(this.productId, qtyToDispatch));
    return this.reservedQty;
  }

  receive(qtyToReceive: Quantity): Quantity {
    this.availableQty = this.availableQty.increaseBy(qtyToReceive);
    this.apply(new ProductReceivedEvent(this.productId, qtyToReceive));
    return this.availableQty;
  }
}
