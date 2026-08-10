import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProductReadModelRepository,
  ProductReadModel,
} from '../../../../core/application/product/ports/product-read-model.repository.interface.js';
import {
  ProductReadModelDocument,
  ProductReadModelSchema,
} from '../schemas/product-read-model.schema.js';

@Injectable()
export class ProductReadModelMongo implements ProductReadModelRepository {
  constructor(
    @InjectModel(ProductReadModelSchema.name)
    private productReadModel: Model<ProductReadModelDocument>,
  ) {}

  async findById(productId: string): Promise<ProductReadModel | null> {
    const doc = await this.productReadModel.findOne({ productId }).exec();
    if (!doc) return null;
    return {
      productId: doc.productId,
      name: doc.name,
      unitPrice: doc.unitPrice,
      availableQty: doc.availableQty,
      reservedQty: doc.reservedQty,
      minThres: doc.minThres,
      maxThres: doc.maxThres,
    };
  }

  async findAll(): Promise<ProductReadModel[]> {
    const docs = await this.productReadModel.find().exec();
    return docs.map((doc) => ({
      productId: doc.productId,
      name: doc.name,
      unitPrice: doc.unitPrice,
      availableQty: doc.availableQty,
      reservedQty: doc.reservedQty,
      minThres: doc.minThres,
      maxThres: doc.maxThres,
    }));
  }

  async upsert(product: ProductReadModel): Promise<void> {
    await this.productReadModel.findOneAndUpdate(
      { productId: product.productId },
      { $set: product },
      { upsert: true, returnDocument: 'after' },
    ).exec();
  }

  async delete(productId: string): Promise<void> {
    await this.productReadModel.deleteOne({ productId }).exec();
  }
}
