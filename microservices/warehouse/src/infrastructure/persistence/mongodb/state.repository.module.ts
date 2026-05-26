import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StateRepositoryMongo } from './state.repository.impl';
import { StateSchemaFactory, StateSchemaName } from './schemas/state.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StateSchemaName, schema: StateSchemaFactory }]),
  ],
  providers: [
    {
      provide: 'STATEREPOSITORY',
      useClass: StateRepositoryMongo,
    },
  ],
  exports: ['STATEREPOSITORY'],
})
export class StateRepositoryModule {}
