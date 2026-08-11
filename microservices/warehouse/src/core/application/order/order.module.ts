import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, OrderMongoSchema } from '../../../infrastructure/persistence/mongodb/schemas/order.schema.js';
import { OrderReadModelSchema, OrderReadModelMongoSchema } from '../../../infrastructure/persistence/mongodb/schemas/order-read-model.schema.js';
import { ReservationSchema, ReservationMongoSchema } from '../../../infrastructure/persistence/mongodb/schemas/reservation.schema.js';
import { OrderRepositoryMongo } from '../../../infrastructure/persistence/mongodb/order.repository.mongo.js';
import { ReservationRepositoryMongo } from '../../../infrastructure/persistence/mongodb/reservation.repository.mongo.js';
import { OrderReadModelMongo } from '../../../infrastructure/persistence/mongodb/read-models/order-read-model.mongo.js';
import { CreateOrderCommandHandler } from '../../application/order/use-cases/command/handlers/create-order.handler.js';
import { CancelOrderCommandHandler } from '../../application/order/use-cases/command/handlers/cancel-order.handler.js';
import { ValidateOrderCommandHandler } from '../../application/order/use-cases/command/handlers/validate-order.handler.js';
import { DispatchOrderCommandHandler } from '../../application/order/use-cases/command/handlers/dispatch-order.handler.js';
import { DeliverOrderCommandHandler } from '../../application/order/use-cases/command/handlers/deliver-order.handler.js';
import { OrderReadModelUpdater } from '../../application/order/event-handlers/order-read-model-updater.js';
import { UpdateOrderStateHandler } from '../../application/order/event-handlers/update-order-state.handler.js';
import { OrderValidationFailedHandler } from '../../application/order/event-handlers/order-validation-failed.handler.js';
import { OrderDispatchedEventHandler } from '../../application/order/event-handlers/order-dispatched-event.handler.js';
import { OrderSaga } from '../../application/order-saga/order.saga.js';
import { NatsMessagingModule } from '../../../infrastructure/messaging/nats/nats-messaging.module.js';
import { ProductModule } from '../product/product.module.js';
import { GetAllOrdersQueryHandler } from './use-cases/query/handlers/get-all-orders.handler.js';
import { GetOrderQueryHandler } from './use-cases/query/handlers/get-order.handler.js';
import { OrderEventCloudHandler } from './event-handlers/order-event-cloud-handler.js';
import { OrderEventDestinationWhHandler } from './event-handlers/order-event-destination-wh-handler.js';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { OrderQueryService } from './order.query.service.js';
import { InboundOrderEventListenerNats } from '../../../infrastructure/messaging/nats/inbound-order-event.listener.nats.js';
 
const CommandHandlers = [
  CreateOrderCommandHandler,
  CancelOrderCommandHandler,
  ValidateOrderCommandHandler,
  DispatchOrderCommandHandler,
  DeliverOrderCommandHandler,
];

const QueryHandlers = [
  GetOrderQueryHandler,
  GetAllOrdersQueryHandler,
];

const EventHandlers = [
  OrderReadModelUpdater,
  OrderEventCloudHandler,
  UpdateOrderStateHandler,
  OrderEventDestinationWhHandler,
  OrderValidationFailedHandler,
  OrderDispatchedEventHandler,
];

@Module({
  imports: [
    CqrsModule,
    NatsMessagingModule,
    ProductModule,
    MongooseModule.forFeature([
      { name: OrderSchema.name, schema: OrderMongoSchema },
      { name: OrderReadModelSchema.name, schema: OrderReadModelMongoSchema },
      { name: ReservationSchema.name, schema: ReservationMongoSchema },
    ]),
  ],
  controllers: [
    OrderController,
    InboundOrderEventListenerNats
  ],
  providers: [
    OrderService,
    OrderQueryService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepositoryMongo,
    },
    {
      provide: 'IReservationRepository',
      useClass: ReservationRepositoryMongo,
    },
    {
      provide: 'IOrderReadModelRepository',
      useClass: OrderReadModelMongo,
    },
    {
      provide: 'OrderCommandUseCase',
      useExisting: OrderService,
    },
    {
      provide: 'OrderQueryUseCase',
      useExisting: OrderQueryService,
    },
    OrderSaga,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: ['IOrderRepository', 'IReservationRepository', MongooseModule],
})
export class OrderModule {}
