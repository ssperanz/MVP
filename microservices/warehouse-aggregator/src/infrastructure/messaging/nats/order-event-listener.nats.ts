import { Controller, Inject, Injectable } from '@nestjs/common';
import { Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';
import { OrderCreatedDto } from '../../../core/application/order/dto/order-created.dto';
import { UpdateOrderStateDto } from '../../../core/application/order/dto/update-order-state.dto';
import { OrderEventListener } from '../../../core/application/order/ports/order-event-listener.port';
import { OrderReadModelRepositoryMongo } from '../../../infrastructure/persistence/mongodb/order-read-model.repository';

@Controller()
export class OrderEventListenerNats {
  constructor(
    @Inject('IOrderReadModelRepository')
    private readonly orderReadModelRepository: OrderReadModelRepositoryMongo) {}
  
  @EventPattern('warehouse.*.order.created')
  async onOrderCreated(
    @Payload() dto: OrderCreatedDto,
    @Ctx() context: NatsContext
  ): Promise<void> {
    const sourceWh = this.getWarehouseId(context);

    await this.orderReadModelRepository.upsert(dto, sourceWh);
  };
  
  @EventPattern('warehouse.*.order.state.updated')
  async onOrderUpdated(
    @Payload() dto: UpdateOrderStateDto,
    @Ctx() context: NatsContext
  ): Promise<void> {
    const sourceWh = this.getWarehouseId(context);
      console.log('ORDER STATE UPDATED RECEIVED', {
    subject: context.getSubject(),
    dto,
    sourceWh,
  });
    await this.orderReadModelRepository.update(dto, sourceWh);
  }

  private getWarehouseId(context: NatsContext): number {
    const subject = context.getSubject();
    return Number(subject.split('.')[1]);
  }
}