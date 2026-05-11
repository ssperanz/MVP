import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderDispatchedDto } from "../dto/order-dispatched.dto";
import { UpdateOrderStateDto } from "../dto/update-order-state.dto";

export const IInboundOrderEventListenerPortToken = Symbol('IInboundOrderEventListenerPort');

export interface InboundOrderEventListenerPort {
    handleInternalOrderArrival(internalOrderArrival: OrderDispatchedDto): Promise<void>
    handleOrderCreated(createOrder: CreateOrderDto): Promise<void>
    handleOrderStatusUpdated(orderStatusUpdated: UpdateOrderStateDto): Promise<void>
}