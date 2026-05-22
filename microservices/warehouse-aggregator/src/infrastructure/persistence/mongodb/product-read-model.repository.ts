import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductCreatedDto, ProductDeletedDto, ProductUpdatedDto } from 'src/core/application/product/ports/product-event-listener.port';
import type { ProductReadModel, ProductReadModelRepository } from 'src/core/application/product/ports/product-read-model.repository.interface';

@Injectable()
export class ProductReadModelRepositoryMongo implements ProductReadModelRepository {
  constructor(
    @InjectModel('ProductReadModel') private readonly model: Model<ProductReadModel>
  ) {}

  async findByProductId(productId: string): Promise<ProductReadModel[] | null> {
    return this.model.find({ productId }).exec();
  }

  async findByWhId(whId: number): Promise<ProductReadModel[]> {
    return this.model.find({ sourceWh: whId }).exec();
  }

  async findAll(): Promise<ProductReadModel[]> {
    return this.model.find({}).exec();
  }

  async upsert(dto: ProductCreatedDto): Promise<void> {
    await this.model.updateOne(
      { productId: dto.productId, sourceWh: dto.sourceWh },
      { $set: dto },
      { upsert: true }
    ).exec();
  }

  async update(dto: ProductUpdatedDto): Promise<void> {
    const { productId, sourceWh, ...patch } = dto;
    await this.model.updateOne(
      { productId, sourceWh },
      { $set: patch }
    ).exec();
  }

  async delete(dto: ProductDeletedDto): Promise<void> {
    await this.model.deleteOne({ productId: dto.productId, sourceWh: dto.sourceWh }).exec();
  }
}