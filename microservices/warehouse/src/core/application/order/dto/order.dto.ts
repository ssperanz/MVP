export class OrderDto {
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
