"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const warehouseId_entity_1 = require("../domain/warehouseId.entity");
const warehouseAddress_entity_1 = require("../domain/warehouseAddress.entity");
const warehouseState_entity_1 = require("../domain/warehouseState.entity");
const routing_repository_1 = require("../domain/routing.repository");
const geo_1 = require("../interfaces/geo");
const routing_event_adapter_1 = require("../infrastructure/adapters/routing.event.adapter");
let RoutingService = class RoutingService {
    RoutingRepository;
    RoutingEventAdapter;
    constructor(RoutingRepository, RoutingEventAdapter) {
        this.RoutingRepository = RoutingRepository;
        this.RoutingEventAdapter = RoutingEventAdapter;
    }
    async calculateDistance(sourceWarehouseId) {
        const sourceAddressObj = await this.RoutingRepository.getWarehouseAddressById(sourceWarehouseId);
        if (!sourceAddressObj) {
            throw new Error("Magazzino sorgente non trovato");
        }
        console.log('SourceAddressObj:', sourceAddressObj);
        const sourceAddress = sourceAddressObj.getAddress();
        const [sourceLat, sourceLon] = await (0, geo_1.geocodeAddress)(sourceAddress);
        console.log(`SourceAddress: ${sourceAddress}, Lat: ${sourceLat}, Lon: ${sourceLon}`);
        const allAddresses = await this.RoutingRepository.getAllWarehouseAddresses();
        const distances = await Promise.all(allAddresses
            .filter(addr => addr.getWarehouseState().getId().getId() !== sourceWarehouseId.getId())
            .map(async (addr) => {
            const [lat, lon] = await (0, geo_1.geocodeAddress)(addr.getAddress());
            return {
                id: addr.getWarehouseState().getId(),
                distance: (0, geo_1.haversine)([sourceLat, sourceLon], [lat, lon]),
            };
        }));
        console.log(distances);
        return distances
            .sort((a, b) => a.distance - b.distance)
            .map(d => d.id);
    }
    async updateWarehouseAddress(warehouseId, address) {
        if (!address) {
            return false;
        }
        const warehouseState = new warehouseState_entity_1.WarehouseState(warehouseId, 'default');
        const warehouseAddress = new warehouseAddress_entity_1.WarehouseAddress(warehouseState, address);
        await this.RoutingRepository.updateWarehouseAddress(warehouseAddress);
        return JSON.stringify({ result: 'Address updated successfully' });
    }
    async removeWarehouseAddress(warehouseId) {
        await this.RoutingRepository.removeWarehouseAddress(warehouseId);
        return JSON.stringify({ result: 'Address removed successfully' });
    }
    async saveWarehouseAddress(warehouseId, address, state) {
        const warehouseState = new warehouseState_entity_1.WarehouseState(warehouseId, state);
        const warehouseAddress = new warehouseAddress_entity_1.WarehouseAddress(warehouseState, address);
        await this.RoutingRepository.saveWarehouseAddress(warehouseAddress);
    }
    async saveWarehouse(state, address) {
        if (!address || !state) {
            return false;
        }
        const nextId = await this.generateNextWarehouseId();
        const warehouseId = new warehouseId_entity_1.WarehouseId(nextId);
        console.log({
            warehouseId: warehouseId.getId(),
            state: state,
            address: address,
        });
        await this.saveWarehouseAddress(warehouseId, address, state);
        this.RoutingEventAdapter.sendWarehouseAndState({ warehouseId: warehouseId.getId() }, state);
        return JSON.stringify({ result: 'Warehouse created successfully with id ' + warehouseId.getId() });
    }
    async updateWarehouseState(warehouseId, state) {
        if (!state) {
            return false;
        }
        await this.RoutingRepository.updateWarehouseState(new warehouseState_entity_1.WarehouseState(warehouseId, state));
        return JSON.stringify({ result: 'Warehouse state updated successfully' });
    }
    async generateNextWarehouseId() {
        const warehouses = await this.RoutingRepository.getAllWarehouses();
        if (warehouses.length === 0)
            return 1;
        const maxId = Math.max(...warehouses.map(w => w.getId()));
        return maxId + 1;
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("ROUTINGREPOSITORY")),
    __metadata("design:paramtypes", [Object, routing_event_adapter_1.RoutingEventAdapter])
], RoutingService);
//# sourceMappingURL=routing.service.js.map