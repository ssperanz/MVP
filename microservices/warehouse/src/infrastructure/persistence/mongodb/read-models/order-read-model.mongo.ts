import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrderReadModelRepository,
  OrderReadModel,
} from '../../../../core/application/order/ports/order-read-model.repository.interface.js';
import {
  OrderReadModelDocument,
  OrderReadModelSchema,
} from '../schemas/order-read-model.schema.js';

@Injectable()
export class OrderReadModelMongo implements OrderReadModelRepository {
  constructor(
    @InjectModel(OrderReadModelSchema.name)
    private orderReadModel: Model<OrderReadModelDocument>,
  ) {}

  async findById(orderId: string): Promise<OrderReadModel | null> {
    const doc = await this.orderReadModel.findOne({ orderId }).exec();
    if (!doc) return null;
    return this.toReadModel(doc);
  }

  async findAll(): Promise<OrderReadModel[]> {
    const docs = await this.orderReadModel.find().exec();
    return docs.map((d) => this.toReadModel(d));
  }

  async upsert(order: OrderReadModel): Promise<void> {
    await this.orderReadModel.findOneAndUpdate(
      { orderId: order.orderId },
      { $set: order },
      { upsert: true, new: true },
    ).exec();
  }

  private toReadModel(doc: OrderReadModelDocument): OrderReadModel {
    return {
      orderId: doc.orderId,
      orderItems: doc.orderItems,
      orderType: doc.orderType,
      orderState: doc.orderState,
      orderCreationDate: doc.orderCreationDate,
      departureWh: doc.departureWh,
      totalOrderValue: doc.totalOrderValue,
      destination: doc.destination,
      destinationWh: doc.destinationWh,
      orderReference: doc.orderReference,
    };
  }
}
