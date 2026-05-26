import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { NatsMessagingModule } from "src/infrastructure/messaging/nats/nats-messaging.module";
import { ProductReadModel, ProductReadModelMongoSchema } from "src/infrastructure/persistence/mongodb/schemas/product-read-model.schema";
import { ProductController } from "./product.controller";
import { ProductEventListenerNats } from "src/infrastructure/messaging/nats/product-event-listener.nats";
import { ProductQueryService } from "./product.query.service";

@Module({
  imports: [
    CqrsModule,
    NatsMessagingModule,
    MongooseModule.forFeature([
      { name: ProductReadModel.name, schema: ProductReadModelMongoSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductEventListener',
      useClass: ProductEventListenerNats,
    },
    ProductQueryService,
  ],
  exports: ['IProductEventListener'],
})

export class ProductsModule {}