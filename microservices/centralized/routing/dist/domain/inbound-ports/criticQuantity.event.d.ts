import { WarehouseIdDTO } from "../../interfaces/dto/warehouseId.dto";
export interface CriticQuantityEvent {
    receiveRequest(warehouseId: WarehouseIdDTO): Promise<string>;
}
