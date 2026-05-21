import { Query } from '@nestjs/cqrs';
import { InventoryDto } from '../../dto/inventory.dto';

export class GetInventoryQuery extends Query<InventoryDto> {
  constructor() {
    super();
  }
}
