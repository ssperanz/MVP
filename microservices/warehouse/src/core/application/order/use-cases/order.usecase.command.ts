import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderIdDto } from "../dto/order-id.dto";
import { OrderDto } from "../dto/order.dto";

export interface OrderCommandUseCase {
  createOrder(dto: CreateOrderDto): Promise<OrderDto>;
  cancelOrder(orderId: OrderIdDto): Promise<void>;
}