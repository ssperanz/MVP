import { Module } from '@nestjs/common';
import { WarehouseAggregatorController } from './warehouse-aggregator.controller';
import { WarehouseAggregatorService } from './warehouse-aggregator.service';
import { NatsMessagingModule } from './infrastructure/messaging/nats/nats-messaging.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './core/application/order/orders.module';
import { ProductsModule } from './core/application/product/products.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/warehouse-aggregator/', {

    }),
    NatsMessagingModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class WarehouseAggregatorModule {}
 