import { WarehouseIdDTO } from "../dto/warehouse-id.dto";
import { WarehouseStateDTO } from "../dto/warehouse-state.dto";

export interface GetStateUseCase {
  getSyncedState(dto: WarehouseIdDTO): Promise<WarehouseStateDTO | null>;
}
