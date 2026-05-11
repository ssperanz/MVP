import { OrderIdDto } from "../dto/order-id.dto";
import { OrderDto } from "../dto/order.dto";

export interface OrderUseCase {
  getOrderById(orderId: OrderIdDto): Promise<OrderDto>;
  listOrders(): Promise<OrderDto[]>;
}