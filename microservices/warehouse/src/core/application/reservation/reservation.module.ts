import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ReservationRepositoryMongo } from 'src/infrastructure/persistence/mongodb/reservation.repository.mongo';
import { ReservationMongoSchema, ReservationSchema } from "src/infrastructure/persistence/mongodb/schemas/reservation.schema";
import { CreateReservationCommandHandler } from './use-cases/command/handlers/create-reservation.handler';
import { CancelReservationCommandHandler } from './use-cases/command/handlers/cancel-reservation.handler';
import { UpdateReservationCommandHandler } from './use-cases/command/handlers/update-reservation.handler';

const CommandHandlers = [
  CreateReservationCommandHandler,
  CancelReservationCommandHandler,
  UpdateReservationCommandHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: ReservationSchema.name, 
        schema: ReservationMongoSchema
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: 'IReservationRepository',
      useClass: ReservationRepositoryMongo,
    },
    ...CommandHandlers,
  ],
  exports: [],
})
export class ReservationModule {}