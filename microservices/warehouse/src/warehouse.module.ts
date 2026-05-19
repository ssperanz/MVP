import { Module } from '@nestjs/common';
import { NatsMessagingModule } from './infrastructure/messaging/nats/nats-messaging.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './core/application/product/product.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/warehouse'),
    NatsMessagingModule,
    ProductModule,
    // OrderModule,
  ],
  providers: [],
  controllers: [],

})
export class WarehouseModule {}
