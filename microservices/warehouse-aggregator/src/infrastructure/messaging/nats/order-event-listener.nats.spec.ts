import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderCreatedDto } from 'src/core/application/order/dto/order-created.dto';
import { UpdateOrderStateDto } from 'src/core/application/order/dto/update-order-state.dto';
import { OrderEventListener } from 'src/core/application/order/ports/order-event-listener.port';
import { OrderReadModelRepositoryMongo } from 'src/infrastructure/persistence/mongodb/order-read-model.repository';
import { OrderEventListenerNats } from './order-event-listener.nats';

describe('OrderEventListenerNats', () => {
  let orderEventListenerNats: OrderEventListenerNats;
  let orderReadModelRepositoryMock: OrderReadModelRepositoryMongo;

  beforeEach(() => {
    orderReadModelRepositoryMock = {
      upsert: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    } as unknown as OrderReadModelRepositoryMongo;

    orderEventListenerNats = new OrderEventListenerNats(orderReadModelRepositoryMock);
  });

  it('should call upsert on orderReadModelRepository when onOrderCreated is called', async () => {
    const dto: OrderCreatedDto = { orderId: '12345', orderItems: [], sourceWh: 1, orderType: 'TRANSFER' };
    await orderEventListenerNats.onOrderCreated(dto);

    expect(orderReadModelRepositoryMock.upsert).toHaveBeenCalledWith(dto);
  });

  it('should call update on orderReadModelRepository when onOrderUpdated  is called', async () => {
    const dto: UpdateOrderStateDto = { sourceWh: 1, orderId: '12345', orderState: 'DELIVERED' };
    await orderEventListenerNats.onOrderUpdated(dto);

    expect(orderReadModelRepositoryMock.update).toHaveBeenCalledWith(dto);
  });
});