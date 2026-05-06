import { WarehouseId } from './warehouse-id.vo.js';

export class InternalOrder {
  constructor(private readonly destinationWh: WarehouseId) {}

  getDestinationWh(): WarehouseId {
    return this.destinationWh;
  }
}
