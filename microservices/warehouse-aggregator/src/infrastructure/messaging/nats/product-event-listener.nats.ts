import { Controller, Inject, Injectable } from '@nestjs/common';
import { Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';
import type { ProductCreatedDto, ProductDeletedDto, ProductEventListener, ProductUpdatedDto } from 'src/core/application/product/ports/product-event-listener.port';
import type { ProductReadModelRepository } from 'src/core/application/product/ports/product-read-model.repository.interface';

@Controller()
export class ProductEventListenerNats {
  constructor(
    @Inject('IProductReadModelRepository')
    private readonly productReadModelRepository: ProductReadModelRepository,
  ) {}

  @EventPattern('warehouse.*.product.created')
  async onProductCreated(
    @Payload() dto: ProductCreatedDto,
    @Ctx() context: NatsContext,
  ) {
    const sourceWh = this.getWarehouseId(context);

    await this.productReadModelRepository.upsert(dto, sourceWh);
  }

  @EventPattern('warehouse.*.product.*.updated')
  async onProductUpdated(
    @Payload() dto: ProductUpdatedDto,
    @Ctx() context: NatsContext,
  ) {
    const sourceWh = this.getWarehouseId(context);

    await this.productReadModelRepository.update(dto, sourceWh);
  }

  @EventPattern('warehouse.*.product.deleted')
  async onProductDeleted(
    @Payload() dto: ProductDeletedDto,
    @Ctx() context: NatsContext,
  ) {
    const sourceWh = this.getWarehouseId(context);

    await this.productReadModelRepository.delete(dto, sourceWh);
  }

  private getWarehouseId(context: NatsContext): number {
    const subject = context.getSubject();
    return Number(subject.split('.')[1]);
  }
}