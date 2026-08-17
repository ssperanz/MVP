import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductEventCloudPublisherNats } from './product-event-cloud.publisher.nats.js';
import { OrderEventCloudPublisherNats } from './order-event-cloud.publisher.nats.js';
import { ReplenishmentRequestPublisherNats } from './replenishment-request.publisher.nats.js';
import { DispatchNotifierPublisherNats } from './dispatch-notifier.publisher.nats.js';
import { DeliverNotifierPublisherNats } from './deliver-notifier.publisher.nats.js';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
        },
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: 'IProductEventCloudPublisher',
      useClass: ProductEventCloudPublisherNats,
    },
    {
      provide: 'IOrderEventCloudPublisher',
      useClass: OrderEventCloudPublisherNats,
    },
    {
      provide: 'IReplenishmentRequestPort',
      useClass: ReplenishmentRequestPublisherNats,
    },
    {
      provide: 'IDispatchNotifierPort',
      useClass: DispatchNotifierPublisherNats,
    },
    {
      provide: 'IDeliverNotifierPort',
      useClass: DeliverNotifierPublisherNats,
    },
  ],
  exports: [
    ClientsModule,
    'IProductEventCloudPublisher',
    'IOrderEventCloudPublisher',
    'IReplenishmentRequestPort',
    'IDispatchNotifierPort',
    'IDeliverNotifierPort',
  ],
})
export class NatsMessagingModule {}
