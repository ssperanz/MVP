import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StateRepositoryModule } from 'src/infrastructure/persistence/mongodb/state.repository.module';
import { NatsMessagingModule } from 'src/infrastructure/messaging/nats/nats-messaging.module';
import { StateController } from './state.controller';
import { AccessController } from './access.controller';
import { InboundPortsAdapter } from 'src/infrastructure/messaging/nats/state/inboundPortAdapters';
import { StateEventHandler } from './event-handler/state-event.handler';
import { OutboundPortsAdapter } from 'src/infrastructure/messaging/nats/state/outboundPortAdapters';
@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    NatsMessagingModule,
    StateRepositoryModule,
  ],
  controllers: [StateController, AccessController],       
  providers: [
    StateService,
    // {
    //   provide: StateEventAdapter,
    //   useFactory: (outboundService: OutboundService) => new StateEventAdapter(outboundService),
    //   inject: [OutboundService],
    // },
    InboundPortsAdapter, 
    StateEventHandler, 
    OutboundPortsAdapter
  ], 
  exports: [StateService],
})
export class StateModule {}
