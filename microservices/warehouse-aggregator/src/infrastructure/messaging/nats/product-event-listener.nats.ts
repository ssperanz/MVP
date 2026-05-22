import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { ProductCreatedDto, ProductDeletedDto, ProductEventListener, ProductUpdatedDto } from 'src/core/application/product/ports/product-event-listener.port';
import type { ProductReadModelRepository } from 'src/core/application/product/ports/product-read-model.repository.interface';

@Injectable()
export class ProductEventListenerNats implements ProductEventListener {
  constructor(private readonly productReadModelRepository: ProductReadModelRepository) {}

  @EventPattern('warehouse.*.product.created')
  async onProductCreated(@Payload() dto: ProductCreatedDto) {
    await this.productReadModelRepository.upsert(dto);
  }

  @EventPattern('warehouse.*.product.*.updated')
  async onProductUpdated(@Payload() dto: ProductUpdatedDto) {
    await this.productReadModelRepository.update(dto);
  }

  @EventPattern('warehouse.*.product.deleted')
  async onProductDeleted(@Payload() dto: ProductDeletedDto) {
    await this.productReadModelRepository.delete(dto);
  }
}