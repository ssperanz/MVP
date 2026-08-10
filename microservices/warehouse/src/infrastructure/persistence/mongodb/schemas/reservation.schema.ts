import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReservationDocument = HydratedDocument<ReservationSchema>;

@Schema({ collection: 'reservations' })
export class ReservationSchema {
  @Prop({ required: true, unique: true })
  orderId: string;

  @Prop({ required: true, type: [{ productId: String, qty: Number, reservedQty: Number, state: String }] })
  reservedItems: Array<{ productId: string; qty: number; reservedQty: number; state: string }>;

  @Prop({ required: true })
  state: string;
}

export const ReservationMongoSchema = SchemaFactory.createForClass(ReservationSchema);
