import { NatsContext } from "@nestjs/microservices";
import { OrderEventListenerNats } from "./order-event-listener.nats";

describe('OrderEventListenerNats', () => {
  let listener: OrderEventListenerNats;
  let orderReadModelRepository: {
    upsert: jest.Mock;
    update: jest.Mock;
  };

  const context = {
    getSubject: jest.fn().mockReturnValue('warehouse.1.order.created'),
  } as unknown as NatsContext;

  beforeEach(() => {
    orderReadModelRepository = {
      upsert: jest.fn(),
      update: jest.fn(),
    };

    listener = new OrderEventListenerNats(
      orderReadModelRepository as any,
    );
  });

  it('should call upsert on orderReadModelRepository when onOrderCreated is called', async () => {
    const dto = {
      orderId: 'order-1',
      orderItems: [],
      orderType: 'TRANSFER',
      departureWh: 1,
      destinationWh: 2,
    } as any;

    await listener.onOrderCreated(dto, context);

    expect(orderReadModelRepository.upsert).toHaveBeenCalledWith(
      dto,
      1,
    );
  });

  it('should call update on orderReadModelRepository when onOrderUpdated is called', async () => {
    const dto = {
      orderId: 'order-1',
      orderState: 'VALIDATED',
    } as any;

    const updateContext = {
      getSubject: jest.fn().mockReturnValue(
        'warehouse.1.order.state.updated',
      ),
    } as unknown as NatsContext;

    await listener.onOrderUpdated(dto, updateContext);

    expect(orderReadModelRepository.update).toHaveBeenCalledWith(
      dto,
      1,
    );
  });
});