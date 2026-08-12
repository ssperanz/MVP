import { WarehouseStateDTO } from "./dto/warehouseState.dto";
import { WarehouseIdDTO } from "./dto/warehouseId.dto";
import { WarehouseAddressDTO } from "./dto/warehouseAddress.dto";
import { WarehouseState } from "./../domain/warehouseState.entity";
import { WarehouseId } from "./../domain/warehouseId.entity";
import { WarehouseAddress } from "./../domain/warehouseAddress.entity";
export declare const DataMapper: {
    warehouseIdToDomain(warehouseIdDTO: WarehouseIdDTO): WarehouseId;
    warehouseStateToDomain(warehouseStateDTO: WarehouseStateDTO): WarehouseState;
    warehouseAddressToDomain(warehouseAddressDTO: WarehouseAddressDTO): WarehouseAddress;
    warehouseAddressToDTO(warehouseAddress: WarehouseAddress): WarehouseAddressDTO;
    warehouseIdToDTO(warehouseId: WarehouseId): WarehouseIdDTO;
    warehouseStateToDTO(warehouseState: WarehouseState): WarehouseStateDTO;
};
