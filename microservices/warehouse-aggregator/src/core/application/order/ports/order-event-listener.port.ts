import { OrderCreatedDto } from "../dto/order-created.dto";
import { UpdateOrderStateDto } from "../dto/update-order-state.dto";

export interface OrderEventListener {
  onOrderCreated(dto: OrderCreatedDto): Promise<void>;
  onOrderUpdated(dto: UpdateOrderStateDto): Promise<void>;
}

