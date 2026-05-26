import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { OrderEventListenerNats } from './order-event-listener.nats';
import { ProductEventListenerNats } from './product-event-listener.nats';


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
      provide: 'IOrderEventListener',
      useClass: OrderEventListenerNats,
    },
    {
      provide: 'IProductEventListener',
      useClass: ProductEventListenerNats,
    },
  ],
  exports: [
    'IOrderEventListener',
    'IProductEventListener',
  ],
})
export class NatsMessagingModule {}
