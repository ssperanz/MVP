import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehouseService {
  getHello(): string {
    return 'Hello World!';
  }
}
