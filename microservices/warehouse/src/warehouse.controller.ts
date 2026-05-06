import { Controller, Get } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller()
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get()
  getHello(): string {
    return this.warehouseService.getHello();
  }
}
