import { NestFactory } from '@nestjs/core';
import { WarehouseAggregatorModule } from './warehouse-aggregator.module';

async function bootstrap() {
  const app = await NestFactory.create(WarehouseAggregatorModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
