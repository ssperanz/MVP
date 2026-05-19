import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductEventCloudPublisherNats } from './product-event-cloud.publisher.nats.js';
import { OrderEventCloudPublisherNats } from './order-event-cloud.publisher.nats.js';
import { OrderEventDestinationWhPublisherNats } from './order-event-destination-wh.publisher.nats.js';
import { ReplenishmentRequestPublisherNats } from './replenishment-request.publisher.nats.js';
import { DispatchNotifierPublisherNats } from './dispatch-notifier.publisher.nats.js';
import { InboundOrderEventListenerNats } from './inbound-order-event.listener.nats.js';

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
      provide: 'IOrderEventDestinationWhPublisher',
      useClass: OrderEventDestinationWhPublisherNats,
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
      provide: 'IInboundOrderEventListenerPort',
      useClass: InboundOrderEventListenerNats,
    }
  ],
  exports: [
    'IProductEventCloudPublisher',
    'IOrderEventCloudPublisher',
    'IOrderEventDestinationWhPublisher',
    'IReplenishmentRequestPort',
    'IDispatchNotifierPort',
    'IInboundOrderEventListenerPort',
  ],
})
export class NatsMessagingModule {}
