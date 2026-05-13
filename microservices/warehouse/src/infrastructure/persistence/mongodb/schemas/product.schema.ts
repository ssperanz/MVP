import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  availableQuantity: number;

  @Prop({ required: true })
  reservedQuantity: number;

  @Prop({ required: true })
  minThres: number;

  @Prop({ required: true })
  maxThres: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);