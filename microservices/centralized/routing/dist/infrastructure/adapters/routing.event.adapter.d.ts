import { OutboundService } from '../../interfaces/outbound.service';
import { WarehouseAddress } from '../../domain/warehouseAddress.entity';
import { WarehouseAddressPublisher } from '../../domain/outbound-ports/warehouseAddress.publisher';
import { WarehouseIdDTO } from '../../interfaces/dto/warehouseId.dto';
export declare class RoutingEventAdapter implements WarehouseAddressPublisher {
    private readonly outboundService;
    constructor(outboundService: OutboundService);
    sendAddress(warehouseAddress: WarehouseAddress): void;
    sendWarehouseAndState(warehouseId: WarehouseIdDTO, state: 'ONLINE' | 'OFFLINE'): void;
}
