import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { OrderReadModelRepository } from '../../../ports/order-read-model.repository.interface';
import { GetOrderByIdQuery } from '../get-order-by-id.query';
import { OrderDto } from '../../../dto/order.dto';
import { GetOrderQueryHandler } from './get-order-by-id.handler';

describe('GetOrderQueryHandler', () => {
  let queryHandler: GetOrderQueryHandler;
  let orderReadModelMock: OrderReadModelRepository;

  beforeEach(() => {
    orderReadModelMock = {
      findByOrderId: jest.fn(),
    } as unknown as OrderReadModelRepository;

    queryHandler = new GetOrderQueryHandler(orderReadModelMock);
  });

  it('should return null if no order is found', async () => {
    (orderReadModelMock.findByOrderId as jest.Mock).mockResolvedValue(null);

    const result = await queryHandler.execute(new GetOrderByIdQuery('nonexistent-id'));

    expect(result).toBeNull();
  });

  it('should return an OrderDto if an order is found', async () => {
    const mockOrder = { id: '1', items: [], total: 100 };
    (orderReadModelMock.findByOrderId as jest.Mock).mockResolvedValue(mockOrder);

    const result = await queryHandler.execute(new GetOrderByIdQuery('existing-id'));

    expect(result).toEqual(expect.objectContaining({ id: '1', items: [], total: 100 }));
  });
});