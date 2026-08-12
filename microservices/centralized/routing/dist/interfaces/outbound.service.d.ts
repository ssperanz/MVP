import { WarehouseIdDTO } from "./dto/warehouseId.dto";
import { WarehouseAddressDTO } from "./dto/warehouseAddress.dto";
import { WarehouseStateDTO } from "./dto/warehouseState.dto";
import { NatsService } from './../interfaces/nats/nats.service';
export declare class OutboundService {
    private readonly natsService;
    constructor(natsService: NatsService);
    sendAddress(address: WarehouseAddressDTO): Promise<void>;
    sendWarehouseDistance(warehouseId: WarehouseIdDTO[]): Promise<void>;
    sendWarehouseAndState(warehouseState: WarehouseStateDTO): Promise<void>;
}
