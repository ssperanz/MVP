import { WarehouseId } from "src/shared/domain/value-objects/warehouse-id.vo";

export class Heartbeat {
  private warehouseId: WarehouseId;
  private heartbeatMsg: string;
  private timestamp: Date;

  constructor(warehouseId: WarehouseId, heartbeatMsg: string, timestamp: Date) {
    this.warehouseId = warehouseId;
    this.heartbeatMsg = heartbeatMsg;
    this.timestamp = timestamp;
  }

  public getHeartbeatMsg(): string {
    return this.heartbeatMsg;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public getId(): number {
    return this.warehouseId.getId();
  }
}
