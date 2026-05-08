export const IOrderReadModelRepositoryToken = Symbol('IOrderReadModelRepository');

export interface OrderReadModelRepository {
  findById(orderId: string): Promise<OrderReadModel | null>;
  findAll(): Promise<OrderReadModel[]>;
  upsert(order: OrderReadModel): Promise<void>;
}

export interface OrderReadModel {
  orderId: string;
  orderItems: Array<{ productId: string; qty: number; unitPrice: number; totalValue: number }>;
  orderType: string;
  orderState: string;
  orderCreationDate: Date;
  departureWh: number;
  totalOrderValue: number;
  destination?: { streetName: string; civicNumber: number; city: string; cap: string; country: string };
  destinationWh?: number;
  orderReference?: string;
}
