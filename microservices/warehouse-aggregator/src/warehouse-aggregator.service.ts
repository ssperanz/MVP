import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehouseAggregatorService {
  getHello(): string {
    return 'Hello World!';
  }
}
