import { QueryBus } from '@nestjs/cqrs';
import { OrderQueryUseCase } from './use-cases/order.usecase.query';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderDto } from './dto/order.dto';
import { GetOrderQuery } from './use-cases/query/get-order.query';
import { GetAllOrdersQuery } from './use-cases/query/get-all-orders.query';
import { Injectable } from '@nestjs/common';
import { OrderQueryService } from './order.query.service';

describe('OrderQueryService', () => {
  let orderQueryService: OrderQueryService;
  let queryBus: QueryBus;

  beforeEach(async () => {
    queryBus = {
      execute: jest.fn(),
    } as unknown as QueryBus;

    orderQueryService = new OrderQueryService(queryBus);
  });

  it('should be defined', () => {
    expect(orderQueryService).toBeDefined();
  });

  it('should call queryBus.execute with GetOrderQuery when getOrderById is called', async () => {
    const orderIdDto: OrderIdDto = { orderId: '123' };
    await orderQueryService.getOrderById(orderIdDto);
    expect(queryBus.execute).toHaveBeenCalledWith(new GetOrderQuery('123'));
  });

  it('should call queryBus.execute with GetAllOrdersQuery when listOrders is called', async () => {
    await orderQueryService.listOrders();
    expect(queryBus.execute).toHaveBeenCalledWith(new GetAllOrdersQuery());
  });
});