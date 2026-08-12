import { Model } from 'mongoose';
import { RoutingRepository } from './../../../domain/routing.repository';
import { WarehouseId } from './../../../domain/warehouseId.entity';
import { WarehouseState } from './../../../domain/warehouseState.entity';
import { WarehouseAddress } from './../../../domain/warehouseAddress.entity';
import { RoutingDocument } from './schemas/routing.schema';
export declare class RoutingRepositoryMongo implements RoutingRepository {
    private routingModel;
    constructor(routingModel: Model<RoutingDocument>);
    saveWarehouse(warehouse: WarehouseId): Promise<void>;
    getWarehouseById(id: WarehouseId): Promise<WarehouseId | null>;
    getAllWarehouses(): Promise<WarehouseId[]>;
    saveWarehouseAddress(address: WarehouseAddress): Promise<void>;
    removeWarehouseAddress(id: WarehouseId): Promise<void>;
    updateWarehouseAddress(address: WarehouseAddress): Promise<void>;
    getWarehouseAddressById(id: WarehouseId): Promise<WarehouseAddress | null>;
    getAllWarehouseAddresses(): Promise<WarehouseAddress[]>;
    saveWarehouseState(state: WarehouseState): Promise<void>;
    getWarehouseStateById(id: WarehouseId): Promise<WarehouseState | null>;
    getAllWarehouseStates(): Promise<WarehouseState[]>;
    updateWarehouseState(state: WarehouseState): Promise<void>;
}
