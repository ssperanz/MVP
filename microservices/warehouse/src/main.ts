import { NestFactory } from '@nestjs/core';
import { WarehouseModule } from './warehouse.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(WarehouseModule);
  app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL ?? 'nats://localhost:4222'],
      },
    }
  );

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
