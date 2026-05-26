import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderCreatedDto } from 'src/core/application/order/dto/order-created.dto';
import { UpdateOrderStateDto } from 'src/core/application/order/dto/update-order-state.dto';
import { OrderEventListener } from 'src/core/application/order/ports/order-event-listener.port';
import { OrderReadModelRepositoryMongo } from 'src/infrastructure/persistence/mongodb/order-read-model.repository';

@Injectable()
export class OrderEventListenerNats implements OrderEventListener {
  constructor(private readonly orderReadModelRepository: OrderReadModelRepositoryMongo) {}
  
  @EventPattern('warehouse.*.order.created')
  async onOrderCreated(@Payload() dto: OrderCreatedDto): Promise<void> {
    await this.orderReadModelRepository.upsert(dto);
  }
  
  @EventPattern('warehouse.*.order.state.updated')
  async onOrderUpdated(@Payload() dto: UpdateOrderStateDto): Promise<void> {
    await this.orderReadModelRepository.update(dto);
  }
}