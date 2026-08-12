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
exports.RoutingRepositoryMongo = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const warehouseId_entity_1 = require("./../../../domain/warehouseId.entity");
const warehouseState_entity_1 = require("./../../../domain/warehouseState.entity");
const warehouseAddress_entity_1 = require("./../../../domain/warehouseAddress.entity");
let RoutingRepositoryMongo = class RoutingRepositoryMongo {
    routingModel;
    constructor(routingModel) {
        this.routingModel = routingModel;
    }
    async saveWarehouse(warehouse) {
        await this.routingModel.create({ warehouseId: warehouse.getId() });
    }
    async getWarehouseById(id) {
        const result = await this.routingModel.findOne({ warehouseId: id.getId() }).exec();
        return result ? new warehouseId_entity_1.WarehouseId(result.warehouseId) : null;
    }
    async getAllWarehouses() {
        const results = await this.routingModel.find().exec();
        return results.map((doc) => new warehouseId_entity_1.WarehouseId(doc.warehouseId));
    }
    async saveWarehouseAddress(address) {
        await this.routingModel.create({
            warehouseId: address.getWarehouseState().getId().getId(),
            state: address.getWarehouseState().getState(),
            address: address.getAddress(),
        });
    }
    async removeWarehouseAddress(id) {
        await this.routingModel.deleteOne({ warehouseId: id.getId() }).exec();
    }
    async updateWarehouseAddress(address) {
        await this.routingModel.updateOne({ warehouseId: address.getWarehouseState().getId().getId() }, {
            address: address.getAddress(),
        }).exec();
    }
    async getWarehouseAddressById(id) {
        const result = await this.routingModel.findOne({ warehouseId: id.getId() }).exec();
        return result
            ? new warehouseAddress_entity_1.WarehouseAddress(new warehouseState_entity_1.WarehouseState(new warehouseId_entity_1.WarehouseId(result.warehouseId), result.state), result.address)
            : null;
    }
    async getAllWarehouseAddresses() {
        const results = await this.routingModel.find().exec();
        return results.map((doc) => new warehouseAddress_entity_1.WarehouseAddress(new warehouseState_entity_1.WarehouseState(new warehouseId_entity_1.WarehouseId(doc.warehouseId), doc.state), doc.address));
    }
    async saveWarehouseState(state) {
        await this.routingModel.create({
            warehouseId: state.getId().getId(),
            state: state.getState(),
        });
    }
    async getWarehouseStateById(id) {
        const result = await this.routingModel.findOne({ warehouseId: id.getId() }).exec();
        return result
            ? new warehouseState_entity_1.WarehouseState(new warehouseId_entity_1.WarehouseId(result.warehouseId), result.state)
            : null;
    }
    async getAllWarehouseStates() {
        const results = await this.routingModel.find().exec();
        return results.map((doc) => new warehouseState_entity_1.WarehouseState(new warehouseId_entity_1.WarehouseId(doc.warehouseId), doc.state));
    }
    async updateWarehouseState(state) {
        await this.routingModel.updateOne({ warehouseId: state.getId().getId() }, { state: state.getState() }).exec();
    }
};
exports.RoutingRepositoryMongo = RoutingRepositoryMongo;
exports.RoutingRepositoryMongo = RoutingRepositoryMongo = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Routing')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RoutingRepositoryMongo);
//# sourceMappingURL=routing.repository.impl.js.map