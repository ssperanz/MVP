import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { OrderIdDto } from './dto/order-id.dto';
import { OrderQueryService } from './order.query.service';
import { OrderDto } from './dto/order.dto';
import { OrderController } from './order.controller';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderQueryServiceMock: Partial<OrderQueryService>;

  beforeEach(() => {
    orderQueryServiceMock = {
      getOrderById: jest.fn(),
      getOrdersByWhId: jest.fn(),
      listAllOrders: jest.fn(),
    };

    orderController = new OrderController(orderQueryServiceMock as OrderQueryService);
  });

  it('should return an order by ID', async () => {
    const mockOrder = { id: '1', items: [], total: 100 };
    (orderQueryServiceMock.getOrderById as jest.Mock).mockResolvedValue(mockOrder);

    const result = await orderController.getOrderById({ orderId: '1' });

    expect(result).toEqual(expect.objectContaining({ id: '1', items: [], total: 100 }));
  });

  it('should return orders by warehouse ID', async () => {
    const mockOrders = [
      { id: '1', items: [], total: 100 },
      { id: '2', items: [], total: 200 },
    ];
    (orderQueryServiceMock.getOrdersByWhId as jest.Mock).mockResolvedValue(mockOrders);

    const result = await orderController.getOrdersByWhId(1);

    expect(result).toEqual([
      expect.objectContaining({ id: '1', items: [], total: 100 }),
      expect.objectContaining({ id: '2', items: [], total: 200 }),
    ]);
  });

  it('should return all orders', async () => {
    const mockOrders = [
      { id: '1', items: [], total: 100 },
      { id: '2', items: [], total: 200 },
    ];
    (orderQueryServiceMock.listAllOrders as jest.Mock).mockResolvedValue(mockOrders);

    const result = await orderController.listAllOrders();

    expect(result).toEqual([
      expect.objectContaining({ id: '1', items: [], total: 100 }),
      expect.objectContaining({ id: '2', items: [], total: 200 }),
    ]);
  });
});