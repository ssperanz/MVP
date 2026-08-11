import { Module } from '@nestjs/common';
import { NatsMessagingModule } from './infrastructure/messaging/nats/nats-messaging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './core/application/product/product.module';
import { OrderModule } from './core/application/order/order.module';
import { ReservationModule } from './core/application/reservation/reservation.module';
import { StateModule } from './core/application/state/state.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || 
      //'mongodb://localhost:27018/warehouse_test' || 
      `mongodb://mongo:27017/warehouse/${process.env.WAREHOUSE_ID}/`, {

    }),
    NatsMessagingModule,
    ProductModule,
    OrderModule,
    ReservationModule,
    StateModule
  ],
  providers: [],
  controllers: [],

})
export class WarehouseModule {}
