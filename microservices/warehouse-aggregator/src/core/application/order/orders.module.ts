import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { NatsMessagingModule } from "src/infrastructure/messaging/nats/nats-messaging.module";
import { OrderEventListenerNats } from "src/infrastructure/messaging/nats/order-event-listener.nats";
import { OrderReadModel, OrderReadModelMongoSchema } from "src/infrastructure/persistence/mongodb/schemas/order-read-model.schema";
import { OrderReadModelRepositoryMongo } from "src/infrastructure/persistence/mongodb/order-read-model.repository";
import { OrderController } from "./order.controller";
import { OrderQueryService } from "./order.query.service";

@Module({
  imports: [
    CqrsModule,
    NatsMessagingModule,
    MongooseModule.forFeature([
      { name: OrderReadModel.name, schema: OrderReadModelMongoSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: 'IOrderEventListener',
      useClass: OrderEventListenerNats,
    },
    OrderQueryService,
    OrderReadModelRepositoryMongo,
  ],
  exports: ['IOrderEventListener'],
})

export class OrdersModule {}