import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCreatedDto, ProductDeletedDto, ProductUpdatedDto } from 'src/core/application/product/ports/product-event-listener.port';
import type { ProductReadModelRepository } from 'src/core/application/product/ports/product-read-model.repository.interface';
import type { ProductReadModel } from './schemas/product-read-model.schema';

@Injectable()
export class ProductReadModelRepositoryMongo implements ProductReadModelRepository {
  constructor(
    @InjectModel('ProductReadModel') private readonly model: Model<ProductReadModel>
  ) {}

  async findByProductId(productId: string): Promise<ProductReadModel[] | null> {
    return this.model.find({ productId }).lean().exec();
  }

  async findByWhId(whId: number): Promise<ProductReadModel[]> {
    return this.model.find({ sourceWh: whId }).lean().exec();
  }

  async findAll(): Promise<ProductReadModel[]> {
    return this.model.find({}).lean().exec();
  }

  async upsert(dto: ProductCreatedDto, sourceWh: number): Promise<void> {
    await this.model.updateOne(
      { productId: dto.productId, sourceWh: sourceWh },
      { $set: { ...dto, sourceWh } },
      { upsert: true }
    ).exec();
  }

  async update(dto: ProductUpdatedDto, sourceWh: number): Promise<void> {
    const { productId, ...patch } = dto;
    await this.model.updateOne(
      { productId, sourceWh },
      { $set: { ...patch, sourceWh } }
    ).exec();
  }

  async delete(dto: ProductDeletedDto, sourceWh: number): Promise<void> {
    await this.model.deleteOne({ productId: dto.productId, sourceWh: sourceWh }).exec();
  }
}