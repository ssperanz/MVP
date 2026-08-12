import { WarehouseId } from './warehouseId.entity';
export declare class WarehouseState {
    private warehouseId;
    private state;
    constructor(warehouseId: WarehouseId, state: string);
    getState(): string;
    getId(): WarehouseId;
    setState(newState: string): void;
}
