import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderDispatchedDto } from './dto/order-dispatched.dto';
import { UpdateOrderStateDto } from './dto/update-order-state.dto';
import { OrderState } from '../../../shared/domain/enums/order-state.enum';
import { OrderService } from './order.service';
import { OrderType } from '../../../shared/domain/enums/order-type.enum';

describe('OrderService', () => {
  let orderService: OrderService;
  let commandBus: CommandBus;

  beforeEach(() => {
    commandBus = {
      execute: jest.fn(),
    } as unknown as CommandBus;

    orderService = new OrderService(commandBus);
  });

  it('should create an order', async () => {
    const createOrderDto: CreateOrderDto = {
      orderType: OrderType.TRANSFER,
      items: [],
      departure: 2,
      destinationWh: 1,
      orderReference: undefined,
    };

    await orderService.createOrder(createOrderDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        orderType: createOrderDto.orderType,
        items: createOrderDto.items,
        departure: createOrderDto.departure,
        destination: createOrderDto.destinationWh,
        orderReference: createOrderDto.orderReference || null,
      })
    );
  });

  it('should cancel an order', async () => {
    const orderIdDto: OrderIdDto = {
      orderId: 'order-1',
    };

    await orderService.cancelOrder(orderIdDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
      })
    );
  });

  it('should deliver an order', async () => {
    const orderDispatchedDto: OrderDispatchedDto = {
      orderId: 'order-1',
    };

    await orderService.deliverOrder(orderDispatchedDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: orderDispatchedDto.orderId,
      })
    );
  });

  it('should update the status of an order', async () => {
    const updateOrderStateDto: UpdateOrderStateDto = {
      orderId: 'order-1',
      orderType: OrderType.TRANSFER,
      newState: OrderState.DELIVERED,
    };

    await orderService.updateOrderStatus(updateOrderStateDto);

    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: updateOrderStateDto.orderId,
        newState: updateOrderStateDto.newState,
      })
    );
  });
});