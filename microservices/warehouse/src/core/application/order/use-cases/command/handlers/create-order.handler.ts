import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateOrderCommand } from '../create-order.command.js';
import type { OrderRepository } from '../../../ports/order.repository.interface.js';
import { SellOrder } from '../../../../../domain/order/entities/sell-order.entity.js';
import { TransferOrder } from '../../../../../domain/order/entities/transfer-order.entity.js';
import { ReplenishmentOrder } from '../../../../../domain/order/entities/replenishment-order.entity.js';
import { OrderId } from '../../../../../../shared/domain/value-objects/order-id.vo.js';
import { OrderItem } from '../../../../../../shared/domain/value-objects/order-item.vo.js';
import { ProductId } from '../../../../../../shared/domain/value-objects/product-id.vo.js';
import { Quantity } from '../../../../../../shared/domain/value-objects/quantity.vo.js';
import { Money } from '../../../../../../shared/domain/value-objects/money.vo.js';
import { WarehouseId } from '../../../../../../shared/domain/value-objects/warehouse-id.vo.js';
import { Address } from '../../../../../../shared/domain/value-objects/address.vo.js';
import { OrderType } from '../../../../../../shared/domain/enums/order-type.enum.js';
import type { ProductRepository } from '../../../../product/ports/product.repository.interface.js';
import * as crypto from 'crypto';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepository: OrderRepository,
    @Inject('IProductRepository') private readonly productRepository: ProductRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    const orderId = new OrderId(crypto.randomUUID());
    const departureWh = command.departure != null
      ? new WarehouseId(command.departure)
      : new WarehouseId(0); // TODO: set as this warehouse id

    // Build order items with prices from product catalog
    const orderItems: OrderItem[] = [];
    for (const item of command.items) {
      const product = await this.productRepository.loadById(new ProductId(item.productId));
      const unitPrice = product ? product.getUnitPrice() : new Money(0);
      orderItems.push(
        new OrderItem(new ProductId(item.productId), new Quantity(item.qty), unitPrice),
      );
    }

    let order: any;
    const orderType = command.orderType as OrderType;

    if (orderType === OrderType.SELL) {
      const dest = command.destination as { streetName: string; civicNumber: number; city: string; cap: string; country: string };
      order = SellOrder.create(
        orderId,
        orderItems,
        OrderType.SELL,
        departureWh,
        new Address(dest.streetName, dest.civicNumber, dest.city, dest.cap, dest.country),
      );
    } else if (orderType === OrderType.TRANSFER) {
      const destWh = command.destination as number;
      order = TransferOrder.create(
        orderId,
        orderItems,
        OrderType.TRANSFER,
        departureWh,
        new WarehouseId(destWh),
      );
    } else if (orderType === OrderType.REPLENISHMENT) {
      const destWh = command.destination as number;
      order = ReplenishmentOrder.create(
        orderId,
        orderItems,
        OrderType.REPLENISHMENT,
        departureWh,
        new WarehouseId(destWh),
        command.orderReference ? new OrderId(command.orderReference) : undefined,
      );
    } else {
      throw new Error(`Unknown order type: ${command.orderType}`);
    }

    const tracked = this.publisher.mergeObjectContext(order);
    await this.orderRepository.save(tracked);
    tracked.commit();
  }
}
