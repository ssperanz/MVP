import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderReadModelDocument = HydratedDocument<OrderReadModelSchema>;

@Schema({ collection: 'order_read_models' })
export class OrderReadModelSchema {
  @Prop({ required: true, unique: true })
  orderId: string;

  @Prop({ required: true, type: [{ productId: String, qty: Number, unitPrice: Number, totalValue: Number }] })
  orderItems: Array<{ productId: string; qty: number; unitPrice: number; totalValue: number }>;

  @Prop({ required: true })
  orderType: string;

  @Prop({ required: true })
  orderState: string;

  @Prop({ required: true })
  orderCreationDate: Date;

  @Prop({ required: true })
  departureWh: number;

  @Prop({ required: true })
  totalOrderValue: number;

  @Prop({ type: { streetName: String, civicNumber: Number, city: String, cap: String, country: String }, required: false })
  destination?: { streetName: string; civicNumber: number; city: string; cap: string; country: string };

  @Prop({ required: false })
  destinationWh?: number;

  @Prop({ required: false })
  orderReference?: string;
}

export const OrderReadModelMongoSchema = SchemaFactory.createForClass(OrderReadModelSchema);
