import { WarehouseId } from "src/shared/domain/value-objects/warehouse-id.vo";
import { WarehouseState } from "src/core/domain/state/entities/warehouse-state.entity";

export const StateRepository = Symbol("STATE_REPOSITORY");

export interface StateRepository {
  getState(warehouseId: WarehouseId): Promise<WarehouseState | null>;
  updateState(state: WarehouseState, warehouseId: WarehouseId): Promise<boolean>;
}

