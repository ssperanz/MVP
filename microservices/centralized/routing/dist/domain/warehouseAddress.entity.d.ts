import { WarehouseState } from './warehouseState.entity';
import { WarehouseId } from './warehouseId.entity';
export declare class WarehouseAddress {
    private warehouseState;
    private address;
    constructor(warehouseState: WarehouseState, address: string);
    getWarehouseState(): WarehouseState;
    getAddress(): string;
    getId(): WarehouseId;
    setState(newState: string): void;
    setAddress(newAddress: string): void;
}
