"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseAddress = void 0;
class WarehouseAddress {
    warehouseState;
    address;
    constructor(warehouseState, address) {
        this.warehouseState = warehouseState;
        this.address = address;
    }
    getWarehouseState() {
        return this.warehouseState;
    }
    getAddress() {
        return this.address;
    }
    getId() {
        return this.warehouseState.getId();
    }
    setState(newState) {
        this.warehouseState.setState(newState);
    }
    setAddress(newAddress) {
        this.address = newAddress;
    }
}
exports.WarehouseAddress = WarehouseAddress;
//# sourceMappingURL=warehouseAddress.entity.js.map