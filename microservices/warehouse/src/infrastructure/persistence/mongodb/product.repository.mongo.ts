import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../../core/domain/product/entities/product.entity.js';
import { ProductRepository } from '../../../core/application/product/ports/product.repository.interface.js';
import { ProductId } from '../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { ProductDocument, Product as ProductSchema } from './schemas/product.schema.js';

@Injectable()
export class ProductRepositoryMongo implements ProductRepository {
  constructor(
    @InjectModel(ProductSchema.name) private productModel: Model<ProductDocument>,
  ) {}

  async save(product: Product): Promise<void> {
    const data = {
      id: product.getId().id,
      name: product.getName(),
      unitPrice: product.getUnitPrice().getAmount(),
      availableQuantity: product.getAvailableQty().getValue,
      reservedQuantity: product.getReservedQty().getValue,
      minThres: product.getMinThres().getValue,
      maxThres: product.getMaxThres().getValue,
    };

    await this.productModel.findOneAndUpdate(
      { id: data.id },
      { $set: data },
      { upsert: true, new: true },
    ).exec();
  }

  async loadAll(): Promise<Product[]> {
    const docs = await this.productModel.find().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async loadById(id: ProductId): Promise<Product | null> {
    const doc = await this.productModel.findOne({ id: id.id }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async delete(id: ProductId): Promise<void> {
    await this.productModel.deleteOne({ id: id.id }).exec();
  }

  private toDomain(doc: ProductDocument): Product {
    return new Product(
      new ProductId(doc.id),
      doc.name,
      new Money(doc.unitPrice),
      new Quantity(doc.availableQuantity),
      new Quantity(doc.reservedQuantity),
      new Quantity(doc.minThres),
      new Quantity(doc.maxThres),
    );
  }
}
