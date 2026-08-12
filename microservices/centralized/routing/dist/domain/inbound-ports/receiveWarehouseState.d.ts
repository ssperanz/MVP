import { WarehouseStateDTO } from "../../interfaces/dto/warehouseState.dto";
export interface ReceiveWarehouseState {
    updateWarehouseState(state: WarehouseStateDTO): Promise<string | false>;
}
