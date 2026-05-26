import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderReadModelDocument = HydratedDocument<OrderReadModel>;

@Schema({ collection: 'order_read_models' })
export class OrderReadModel {
  @Prop({ required: true })
  sourceWh: number;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true, type: [{ productId: String, quantity: Number, unitPrice: Number }] })
  orderItems: { productId: string; quantity: number; unitPrice: number }[];

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

export const OrderReadModelMongoSchema = SchemaFactory.createForClass(OrderReadModel);

OrderReadModelMongoSchema.index({ sourceWh: 1, orderId: 1 }, { unique: true });