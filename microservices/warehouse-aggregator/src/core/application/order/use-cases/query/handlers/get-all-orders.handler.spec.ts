import { Inject } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { GetAllOrdersQuery } from '../get-all-orders.query';
import type { OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { OrderDto } from '../../../dto/order.dto';
import { GetAllOrdersQueryHandler } from './get-all-orders.handler';
  
describe('GetAllOrdersQueryHandler', () => {
  let queryHandler: GetAllOrdersQueryHandler;
  let orderReadModelMock: OrderReadModelRepository;

  beforeEach(() => {
    orderReadModelMock = {
      findAll: jest.fn(),
    } as unknown as OrderReadModelRepository;

    queryHandler = new GetAllOrdersQueryHandler(orderReadModelMock);
  });

  it('should return an empty array if no orders are found', async () => {
    (orderReadModelMock.findAll as jest.Mock).mockResolvedValue([]);

    const result = await queryHandler.execute(new GetAllOrdersQuery());

    expect(result).toEqual([]);
  });

  it('should return an array of OrderDto if orders are found', async () => {
    const mockOrders = [
      { id: '1', items: [], total: 100 },
      { id: '2', items: [], total: 200 },
    ];
    (orderReadModelMock.findAll as jest.Mock).mockResolvedValue(mockOrders);

    const result = await queryHandler.execute(new GetAllOrdersQuery());

    expect(result).toEqual([
      expect.objectContaining({ id: '1', items: [], total: 100 }),
      expect.objectContaining({ id: '2', items: [], total: 200 }),
    ]);
  });
});