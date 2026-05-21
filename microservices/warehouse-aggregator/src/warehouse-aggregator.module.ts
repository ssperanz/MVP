import { Module } from '@nestjs/common';
import { WarehouseAggregatorController } from './warehouse-aggregator.controller';
import { WarehouseAggregatorService } from './warehouse-aggregator.service';

@Module({
  imports: [],
  controllers: [WarehouseAggregatorController],
  providers: [WarehouseAggregatorService],
})
export class WarehouseAggregatorModule {}
