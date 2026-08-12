"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseState = void 0;
class WarehouseState {
    warehouseId;
    state;
    constructor(warehouseId, state) {
        this.warehouseId = warehouseId;
        this.state = state;
    }
    getState() {
        return this.state;
    }
    getId() {
        return this.warehouseId;
    }
    setState(newState) {
        this.state = newState;
    }
}
exports.WarehouseState = WarehouseState;
//# sourceMappingURL=warehouseState.entity.js.map