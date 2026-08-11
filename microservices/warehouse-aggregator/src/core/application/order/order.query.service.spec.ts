import { QueryBus } from '@nestjs/cqrs';
import { OrderQueryUseCase } from './use-cases/order.usecase.query';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderDto } from './dto/order.dto';
import { GetOrderByIdQuery } from './use-cases/query/get-order-by-id.query';
import { GetAllOrdersQuery } from './use-cases/query/get-all-orders.query';
import { GetOrdersByWhIdQuery } from './use-cases/query/get-orders-by-wh-id.query';
import { OrderQueryService } from './order.query.service';

describe('OrderQueryService', () => {
  let orderQueryService: OrderQueryService;
  let queryBusMock: QueryBus;

  beforeEach(() => {
    queryBusMock = {
      execute: jest.fn(),
    } as unknown as QueryBus;

    orderQueryService = new OrderQueryService(queryBusMock);
  });

  it('should return an order by ID', async () => {
    const mockOrder = { id: '1', items: [], total: 100 };
    (queryBusMock.execute as jest.Mock).mockResolvedValue(mockOrder);

    const result = await orderQueryService.getOrderById({ orderId: '1' });

    expect(result).toEqual(expect.objectContaining({ id: '1', items: [], total: 100 }));
  });

  it('should return orders by warehouse ID', async () => {
    const mockOrders = [
      { id: '1', items: [], total: 100 },
      { id: '2', items: [], total: 200 },
    ];
    (queryBusMock.execute as jest.Mock).mockResolvedValue(mockOrders);

    const result = await orderQueryService.getOrdersByWhId(1);

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
    (queryBusMock.execute as jest.Mock).mockResolvedValue(mockOrders);

    const result = await orderQueryService.listAllOrders();

    expect(result).toEqual([
      expect.objectContaining({ id: '1', items: [], total: 100 }),
      expect.objectContaining({ id: '2', items: [], total: 200 }),
    ]);
  });
});