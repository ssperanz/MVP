import { CreateOrderDto } from "../dto/create-order.dto";
import { OrderIdDto } from "../dto/order-id.dto";

export interface OrderCommandUseCase {
  createOrder(dto: CreateOrderDto): Promise<void>;
  cancelOrder(orderId: OrderIdDto): Promise<void>;
  deliverOrder(orderId: OrderIdDto): Promise<void>;
  updateOrderStatus(orderId: OrderIdDto): Promise<void>;
  notifySuccessfulDeliver(orderId: OrderIdDto): Promise<void>;
}