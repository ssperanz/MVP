import { Controller, Inject } from "@nestjs/common";
import { EventPattern } from "@nestjs/microservices";
import { CancelOrderDto } from "../../../core/application/order/dto/cancel-order.dto";
import { CreateOrderDto } from "../../../core/application/order/dto/create-order.dto";
import { OrderDispatchedDto } from "../../../core/application/order/dto/order-dispatched.dto";
import { UpdateOrderStateDto } from "../../../core/application/order/dto/update-order-state.dto";
import { InboundOrderEventListenerPort } from "../../../core/application/order/ports/inbound-order-event-listener.port";
import type { OrderCommandUseCase } from "src/core/application/order/use-cases/order.usecase.command";
import { InboundOrderEventListenerNats } from "./inbound-order-event.listener.nats";

describe('InboundOrderEventListenerNats', () => {
  let inboundOrderEventListenerNats: InboundOrderEventListenerNats;
  let orderServiceMock: OrderCommandUseCase;

  beforeEach(() => {
    orderServiceMock = {
      createOrder: jest.fn().mockResolvedValue(undefined),
      deliverOrder: jest.fn().mockResolvedValue(undefined),
      updateOrderStatus: jest.fn().mockResolvedValue(undefined),
      cancelOrder: jest.fn().mockResolvedValue(undefined),
    } as unknown as OrderCommandUseCase;

    inboundOrderEventListenerNats = new InboundOrderEventListenerNats(orderServiceMock);
  });

  it('should handle order created event', async () => {
    const dto: CreateOrderDto = { 
      orderType: 'TRANSFER',
      items: [{ productId: 'prod1', qty: 2 }],
      departure: 3,
      destinationWh: 4,
      orderReference: 'ref123'
     };
    await inboundOrderEventListenerNats.handleOrderCreated(dto);
    expect(orderServiceMock.createOrder).toHaveBeenCalledWith(dto);
  });

  it('should handle internal order arrival event', async () => {
    const dto: OrderDispatchedDto = {
      orderId: 'order123',
      orderType: 'TRANSFER',
      items: [{ productId: 'prod1', qty: 2 }],
      sourceWh: 1,
      destinationWh: 2
    };
    await inboundOrderEventListenerNats.handleInternalOrderArrival(dto);
    expect(orderServiceMock.deliverOrder).toHaveBeenCalledWith(dto);
  });

  it('should handle order status updated event', async () => {
    const dto: UpdateOrderStateDto = { 
      orderId: 'order123',
      newState: 'DELIVERING',
      orderType: 'TRANSFER'
     };
    await inboundOrderEventListenerNats.handleOrderStatusUpdated(dto);
    expect(orderServiceMock.updateOrderStatus).toHaveBeenCalledWith(dto);
  });

  it('should handle order cancelled event', async () => {
    const dto: CancelOrderDto = { 
      orderId: 'order123',
     };
    await inboundOrderEventListenerNats.handleOrderCancelledEvent(dto);
    expect(orderServiceMock.cancelOrder).toHaveBeenCalledWith(dto);
  });
});