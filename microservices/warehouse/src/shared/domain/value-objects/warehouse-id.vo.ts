export class WarehouseId {
  private readonly warehouseId: number;

  constructor(warehouseId: number) {
    if (warehouseId == null) throw new Error('WarehouseId cannot be null');
    this.warehouseId = warehouseId;
  }

  getId(): number {
    return this.warehouseId;
  }
}
