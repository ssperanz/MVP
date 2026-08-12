import { RoutingService } from '../application/routing.service';
import { WarehouseAddressDTO } from './dto/warehouseAddress.dto';
import { WarehouseAddressSubscriber } from './../domain/inbound-ports/warehouseAddressSubscriber';
import { CriticQuantityEvent } from './../domain/inbound-ports/criticQuantity.event';
import { ReceiveWarehouseState } from './../domain/inbound-ports/receiveWarehouseState';
import { WarehouseSubscriber } from './../domain/inbound-ports/warehouseSubscriber';
export declare class RoutingController implements WarehouseAddressSubscriber, CriticQuantityEvent, ReceiveWarehouseState, WarehouseSubscriber {
    private readonly routingService;
    constructor(routingService: RoutingService);
    updateAddress(address: WarehouseAddressDTO, context: any): Promise<string | false>;
    removeAddress(address: WarehouseAddressDTO): Promise<string>;
    receiveRequest(payload: any): Promise<string>;
    updateWarehouseState(payload: any): Promise<string | false>;
    createWarehouse(dto: {
        state: string;
        address: string;
    }): Promise<string | false>;
}
