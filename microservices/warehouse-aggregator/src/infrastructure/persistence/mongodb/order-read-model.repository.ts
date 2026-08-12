import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderReadModel } from './schemas/order-read-model.schema';
import { UpdateOrderStateDto } from 'src/core/application/order/dto/update-order-state.dto';
import { OrderCreatedDto } from 'src/core/application/order/dto/order-created.dto';
import { OrderReadModelRepository } from 'src/core/application/order/ports/order-read-model.repository.interface';

@Injectable()
export class OrderReadModelRepositoryMongo implements OrderReadModelRepository {
  constructor(
    @InjectModel('OrderReadModel') private readonly model: Model<OrderReadModel>
  ) {}

  async findByOrderId(orderId: string): Promise<OrderReadModel | null> {
    return this.model.findOne({ orderId }).exec();
  }

  async findByWhId(whId: number): Promise<OrderReadModel[] | null> {
    return this.model.find({ sourceWh: whId }).exec();
  }

  async findAll(): Promise<OrderReadModel[]> {
    return this.model.find({}).exec();
  }

  async upsert(dto: OrderCreatedDto, sourceWh: number): Promise<void> {
    await this.model.updateOne(
      { orderId: dto.orderId, sourceWh },
      { $set: dto },
      { upsert: true }
    ).exec();
  }

  async update(dto: UpdateOrderStateDto, sourceWh: number): Promise<void> {
    const { orderId, ...patch } = dto;
    await this.model.updateOne(
      { orderId, sourceWh },
      { $set: patch }
    ).exec();
  }
}