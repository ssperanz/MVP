import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderRepository } from '../../../core/application/order/ports/order.repository.interface.js';
import { Order } from '../../../core/domain/order/entities/order.entity.js';
import { SellOrder } from '../../../core/domain/order/entities/sell-order.entity.js';
import { TransferOrder } from '../../../core/domain/order/entities/transfer-order.entity.js';
import { ReplenishmentOrder } from '../../../core/domain/order/entities/replenishment-order.entity.js';
import { OrderId } from '../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../shared/domain/value-objects/order-item.vo.js';
import { ProductId } from '../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { WarehouseId } from '../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Address } from '../../../shared/domain/value-objects/address.vo.js';
import { OrderType } from '../../../shared/domain/enums/order-type.enum.js';
import { OrderState } from '../../../shared/domain/enums/order-state.enum.js';
import { OrderDocument, OrderSchema } from './schemas/order.schema.js';

@Injectable()
export class OrderRepositoryMongo implements OrderRepository {
  constructor(
    @InjectModel(OrderSchema.name) private orderModel: Model<OrderDocument>,
  ) {}

  async save(order: Order): Promise<void> {
    const data: any = {
      orderId: order.getOrderId().getId(),
      orderItems: order.getOrderItems().map((i) => ({
        productId: i.getId().id,
        qty: i.getQty().getValue,
        unitPrice: i.getItemPrice().getAmount(),
        totalValue: i.getItemsTotalValue().getAmount(),
      })),
      orderType: order.getOrderType(),
      orderState: order.getOrderState(),
      orderCreationDate: order.getCreationDate(),
      departureWh: order.getWarehouseDeparture(),
      totalOrderValue: order.getTotalOrderValue().getAmount(),
    };

    if (order instanceof SellOrder) {
      const dest = order.getDestination();
      data.destination = {
        streetName: dest.getStreetName(),
        civicNumber: dest.getCivicNumber(),
        city: dest.getCity(),
        cap: dest.getCap(),
        country: dest.getCountry(),
      };
    }

    if (order instanceof TransferOrder) {
      data.destinationWh = order.getDestinationWh().getId();
    }

    if (order instanceof ReplenishmentOrder) {
      data.orderReference = order.getOrderReference().getId();
    }

    await this.orderModel.findOneAndUpdate(
      { orderId: data.orderId },
      { $set: data },
      { upsert: true, new: true },
    ).exec();
  }

  async load(orderId: OrderId): Promise<Order | null> {
    const doc = await this.orderModel.findOne({ orderId: orderId.getId() }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async loadAll(): Promise<Order[]> {
    const docs = await this.orderModel.find().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: OrderDocument): Order {
    const orderId = new OrderId(doc.orderId);
    const orderItems = doc.orderItems.map(
      (i) => new OrderItem(new ProductId(i.productId), new Quantity(i.qty), new Money(i.unitPrice)),
    );
    const orderType = doc.orderType as OrderType;
    const orderState = doc.orderState as OrderState;
    const departureWh = new WarehouseId(doc.departureWh);

    if (orderType === OrderType.SELL && doc.destination) {
      const dest = new Address(
        doc.destination.streetName,
        doc.destination.civicNumber,
        doc.destination.city,
        doc.destination.cap,
        doc.destination.country,
      );
      return new SellOrder(orderId, orderItems, orderType, departureWh, dest, orderState, doc.orderCreationDate);
    }

    if (orderType === OrderType.REPLENISHMENT && doc.destinationWh != null) {
      return new ReplenishmentOrder(
        orderId, orderItems, orderType, departureWh,
        new WarehouseId(doc.destinationWh!),
        doc.orderReference ? new OrderId(doc.orderReference) : orderId,
        orderState, doc.orderCreationDate,
      );
    }

    if (orderType === OrderType.TRANSFER && doc.destinationWh != null) {
      return new TransferOrder(
        orderId, orderItems, orderType, departureWh,
        new WarehouseId(doc.destinationWh!),
        orderState, doc.orderCreationDate,
      );
    }

    return new Order(orderId, orderItems, orderType, orderState, departureWh, doc.orderCreationDate);
  }
}
