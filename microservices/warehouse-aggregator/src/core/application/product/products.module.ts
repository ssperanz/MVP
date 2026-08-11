import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { NatsMessagingModule } from "../../../infrastructure/messaging/nats/nats-messaging.module";
import { ProductReadModel, ProductReadModelMongoSchema } from "../../../infrastructure/persistence/mongodb/schemas/product-read-model.schema";
import { ProductReadModelRepositoryMongo } from "../../../infrastructure/persistence/mongodb/product-read-model.repository";
import { ProductEventListenerNats } from "../../../infrastructure/messaging/nats/product-event-listener.nats";
import { ProductQueryService } from "./product.query.service";
import { ProductController } from "./product.controller";
import { GetInventoryQueryHandler } from "./use-cases/query/handlers/get-inventory.handler";
import { GetProductByProductIdQueryHandler } from "./use-cases/query/handlers/get-product-by-product-id.handler";
import { GetProductByWhIdQueryHandler } from "./use-cases/query/handlers/get-product-by-wh-id.handler";

const QueryHandlers = [
  GetInventoryQueryHandler,
  GetProductByProductIdQueryHandler,
  GetProductByWhIdQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    NatsMessagingModule,
    MongooseModule.forFeature([
      { name: ProductReadModel.name, schema: ProductReadModelMongoSchema },
    ]),
  ],
  controllers: [
    ProductController,
    ProductEventListenerNats
  ],
  providers: [
    ProductQueryService,
    {
      provide: 'IProductQueryUseCase',
      useExisting: ProductQueryService,
    },
    ProductReadModelRepositoryMongo,
    {
      provide: 'IProductReadModelRepository',
      useExisting: ProductReadModelRepositoryMongo,
    },

    ...QueryHandlers
  ],
})

export class ProductsModule {}