import { OrderReadModel } from "src/infrastructure/persistence/mongodb/schemas/order-read-model.schema";
import { OrderCreatedDto } from "../dto/order-created.dto";
import { UpdateOrderStateDto } from "../dto/update-order-state.dto";

export const IOrderReadModelRepositoryToken = Symbol('IOrderReadModelRepository');

export interface OrderReadModelRepository {
  findByOrderId(orderId: string): Promise<OrderReadModel | null>;
  findByWhId(whId: number): Promise<OrderReadModel[] | null>;
  findAll(): Promise<OrderReadModel[]>;
  upsert(dto: OrderCreatedDto, sourceWh: number): Promise<void>;
  update(dto: UpdateOrderStateDto, sourceWh: number): Promise<void>;
}
