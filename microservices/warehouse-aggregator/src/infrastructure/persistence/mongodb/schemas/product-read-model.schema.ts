import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductReadModelDocument = HydratedDocument<ProductReadModel>;

@Schema({ collection: 'aggregated_product_read_models' })
export class ProductReadModel {
  @Prop({ required: true })
  sourceWh: number;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  availableQty: number;

  @Prop({ required: true })
  reservedQty: number;

  @Prop({ required: true })
  minThres: number;

  @Prop({ required: true })
  maxThres: number;
}

export const ProductReadModelMongoSchema = SchemaFactory.createForClass(ProductReadModel);

ProductReadModelMongoSchema.index({ sourceWh: 1, productId: 1 }, { unique: true });