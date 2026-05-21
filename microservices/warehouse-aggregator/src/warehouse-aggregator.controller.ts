import { Controller, Get } from '@nestjs/common';
import { WarehouseAggregatorService } from './warehouse-aggregator.service';

@Controller()
export class WarehouseAggregatorController {
  constructor(private readonly warehouseAggregatorService: WarehouseAggregatorService) {}

  @Get()
  getHello(): string {
    return this.warehouseAggregatorService.getHello();
  }
}
