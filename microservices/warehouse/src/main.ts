import { NestFactory } from '@nestjs/core';
import { WarehouseModule } from './warehouse.module';

async function bootstrap() {
  const app = await NestFactory.create(WarehouseModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
