import { WarehouseId } from '../domain/warehouseId.entity';
import { RoutingRepository } from '../domain/routing.repository';
import { RoutingEventAdapter } from '../infrastructure/adapters/routing.event.adapter';
export declare class RoutingService {
    private readonly RoutingRepository;
    private readonly RoutingEventAdapter;
    constructor(RoutingRepository: RoutingRepository, RoutingEventAdapter: RoutingEventAdapter);
    calculateDistance(sourceWarehouseId: WarehouseId): Promise<WarehouseId[]>;
    updateWarehouseAddress(warehouseId: WarehouseId, address: string): Promise<string | false>;
    removeWarehouseAddress(warehouseId: WarehouseId): Promise<string>;
    saveWarehouseAddress(warehouseId: WarehouseId, address: string, state: string): Promise<void>;
    saveWarehouse(state: string, address: string): Promise<string | false>;
    updateWarehouseState(warehouseId: WarehouseId, state: string): Promise<string | false>;
    generateNextWarehouseId(): Promise<number>;
}
