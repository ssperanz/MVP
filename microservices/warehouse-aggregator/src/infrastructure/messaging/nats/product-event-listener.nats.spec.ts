import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { ProductCreatedDto, ProductDeletedDto, ProductEventListener, ProductUpdatedDto } from 'src/core/application/product/ports/product-event-listener.port';
import type { ProductReadModelRepository } from 'src/core/application/product/ports/product-read-model.repository.interface';
import { ProductEventListenerNats } from './product-event-listener.nats';

describe('ProductEventListenerNats', () => {
  let productEventListenerNats: ProductEventListenerNats;
  let productReadModelRepositoryMock: ProductReadModelRepository;

  beforeEach(() => {
    productReadModelRepositoryMock = {
      upsert: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
    } as unknown as ProductReadModelRepository;

    productEventListenerNats = new ProductEventListenerNats(productReadModelRepositoryMock);
  });

  it('should call upsert on productReadModelRepository when onProductCreated is called', async () => {
    const dto: ProductCreatedDto = { productId: 'prod1', name: 'Product 1', unitPrice: 10, availableQty: 100, reservedQty: 0, minThres: 10, maxThres: 200 };
    await productEventListenerNats.onProductCreated(dto, { getSubject: () => 'warehouse.1.product.created' } as any);

    expect(productReadModelRepositoryMock.upsert).toHaveBeenCalledWith(dto, 1);
  });

  it('should call update on productReadModelRepository when onProductUpdated is called', async () => {
    const dto: ProductUpdatedDto = { productId: 'prod1', name: 'Updated Product 1', unitPrice: 15, availableQty: 150 };
    await productEventListenerNats.onProductUpdated(dto, { getSubject: () => 'warehouse.1.product.updated' } as any);

    expect(productReadModelRepositoryMock.update).toHaveBeenCalledWith(dto, 1);
  });

  it('should call delete on productReadModelRepository when onProductDeleted is called', async () => {
    const dto: ProductDeletedDto = { productId: 'prod1' };
    await productEventListenerNats.onProductDeleted(dto, { getSubject: () => 'warehouse.1.product.deleted' } as any);

    expect(productReadModelRepositoryMock.delete).toHaveBeenCalledWith(dto, 1);
  });
});