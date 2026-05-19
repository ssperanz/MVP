import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service.js';
import { ProductSchema } from '../../../infrastructure/persistence/mongodb/schemas/product.schema.js';
import { ProductReadModelSchema, ProductReadModelMongoSchema } from '../../../infrastructure/persistence/mongodb/schemas/product-read-model.schema.js';
import { ProductRepositoryMongo } from '../../../infrastructure/persistence/mongodb/product.repository.mongo.js';
import { ProductReadModelMongo } from '../../../infrastructure/persistence/mongodb/read-models/product-read-model.mongo.js';
import { CreateProductCommandHandler } from '../../application/product/use-cases/command/handlers/create-product.handler.js';
import { RemoveProductCommandHandler } from '../../application/product/use-cases/command/handlers/remove-product.handler.js';
import { UpdateProductCommandHandler } from '../../application/product/use-cases/command/handlers/update-product.handler.js';
import { NatsMessagingModule } from '../../../infrastructure/messaging/nats/nats-messaging.module.js';
import { GetProductQueryHandler } from './use-cases/query/handlers/get-product.handler.js';
import { GetInventoryQueryHandler } from './use-cases/query/handlers/get-inventory.handler.js';
import { ProductEventCloudHandler } from './event-handler/product-event-cloud-handler.js';
import { ProductReadModelUpdater } from './event-handler/product-read-model-updater.js';
import { ProductController } from './product.controller.js';

const CommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  RemoveProductCommandHandler,
];

const QueryHandlers = [
  GetProductQueryHandler,
  GetInventoryQueryHandler,
];

const EventHandlers = [
  ProductEventCloudHandler,
  ProductReadModelUpdater,
];

@Module({
  imports: [
    CqrsModule,
    NatsMessagingModule,
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: ProductReadModelSchema.name, schema: ProductReadModelMongoSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductRepositoryMongo,
    },
    {
      provide: 'IProductReadModelRepository',
      useClass: ProductReadModelMongo,
    },
    ProductService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [ProductService, 'IProductRepository', MongooseModule],
})
export class ProductModule {}
