import { Order } from '../../../domain/order/entities/order.entity.js';
import { OrderId } from '../../../../shared/domain/value-objects/order-id.vo.js';

export const IOrderRepositoryToken = Symbol('IOrderRepository');

export interface OrderRepository {
  save(order: Order): Promise<void>;
  load(orderId: OrderId): Promise<Order | null>;
  loadAll(): Promise<Order[]>;
}
