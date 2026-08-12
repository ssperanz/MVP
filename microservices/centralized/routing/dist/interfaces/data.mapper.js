"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMapper = void 0;
const warehouseState_entity_1 = require("./../domain/warehouseState.entity");
const warehouseId_entity_1 = require("./../domain/warehouseId.entity");
const warehouseAddress_entity_1 = require("./../domain/warehouseAddress.entity");
exports.DataMapper = {
    warehouseIdToDomain(warehouseIdDTO) {
        return new warehouseId_entity_1.WarehouseId(warehouseIdDTO.warehouseId);
    },
    warehouseStateToDomain(warehouseStateDTO) {
        return new warehouseState_entity_1.WarehouseState(new warehouseId_entity_1.WarehouseId(warehouseStateDTO.warehouseId.warehouseId), warehouseStateDTO.state);
    },
    warehouseAddressToDomain(warehouseAddressDTO) {
        return new warehouseAddress_entity_1.WarehouseAddress(new warehouseState_entity_1.WarehouseState(new warehouseId_entity_1.WarehouseId(warehouseAddressDTO.warehouseState.warehouseId.warehouseId), warehouseAddressDTO.warehouseState.state), warehouseAddressDTO.address);
    },
    warehouseAddressToDTO(warehouseAddress) {
        return {
            warehouseState: exports.DataMapper.warehouseStateToDTO(warehouseAddress.getWarehouseState()),
            address: warehouseAddress.getAddress()
        };
    },
    warehouseIdToDTO(warehouseId) {
        return {
            warehouseId: warehouseId.getId()
        };
    },
    warehouseStateToDTO(warehouseState) {
        return {
            warehouseId: { warehouseId: warehouseState.getId().getId() },
            state: warehouseState.getState()
        };
    },
};
//# sourceMappingURL=data.mapper.js.map