import { WarehouseId } from "src/shared/domain/value-objects/warehouse-id.vo";
import { WarehouseState } from "../../../domain/state/entities/warehouse-state.entity";

export interface StatePortPublisher {
  publishState(warehouseId : WarehouseId ,state: WarehouseState): Promise<void>;
}