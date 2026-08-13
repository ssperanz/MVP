import { Get, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { NatsMessagingModule } from "../../../infrastructure/messaging/nats/nats-messaging.module";
import { OrderEventListenerNats } from "../../../infrastructure/messaging/nats/order-event-listener.nats";
import { OrderReadModel, OrderReadModelMongoSchema } from "../../../infrastructure/persistence/mongodb/schemas/order-read-model.schema";
import { OrderReadModelRepositoryMongo } from "../../../infrastructure/persistence/mongodb/order-read-model.repository";
import { OrderController } from "./order.controller";
import { OrderQueryService } from "./order.query.service";
import { GetOrdersByWhIdQueryHandler } from "./use-cases/query/handlers/get-orders-by-wh-id.handler";
import { GetAllOrdersQueryHandler } from "./use-cases/query/handlers/get-all-orders.handler";
import { GetOrderQueryHandler } from "./use-cases/query/handlers/get-order-by-id.handler";

const QueryHandlers = [
  GetOrderQueryHandler,
  GetAllOrdersQueryHandler,
  GetOrdersByWhIdQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    NatsMessagingModule,
    MongooseModule.forFeature([
      { name: OrderReadModel.name, schema: OrderReadModelMongoSchema },
    ]),
  ],
  controllers: [OrderController, OrderEventListenerNats],
  providers: [
    /*{
      provide: 'IOrderEventListener',
      useClass: OrderEventListenerNats,
    },*/
    {
      provide: 'IOrderReadModelRepository',
      useClass: OrderReadModelRepositoryMongo,
    },
    OrderQueryService,
    OrderReadModelRepositoryMongo,

    ...QueryHandlers
  ],
  exports: [/*'IOrderEventListener'*/],
})

export class OrdersModule {}