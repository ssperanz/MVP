import { WarehouseAddressDTO } from "../../interfaces/dto/warehouseAddress.dto";
export interface WarehouseAddressSubscriber {
    updateAddress(address: WarehouseAddressDTO, context: any): Promise<string | false>;
    removeAddress(address: WarehouseAddressDTO): Promise<string>;
}
