import { WarehouseIdDTO } from "../dto/warehouse-id.dto";

export interface GetStateEventListener {
  getSyncedState(warehouseIdDTO: WarehouseIdDTO): Promise<void>;
}
