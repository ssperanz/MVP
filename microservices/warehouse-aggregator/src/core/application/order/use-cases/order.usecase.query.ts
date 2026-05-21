import { OrderIdDto } from "../dto/order-id.dto";
import { OrderDto } from "../dto/order.dto";

export interface OrderQueryUseCase {
  getOrderById(orderId: OrderIdDto): Promise<OrderDto | null>;
  getOrdersByWhId(whId: number): Promise<OrderDto[] | null>;
  listAllOrders(): Promise<OrderDto[]>;
}