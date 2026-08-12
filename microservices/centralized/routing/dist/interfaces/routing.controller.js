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
exports.RoutingController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const routing_service_1 = require("../application/routing.service");
const warehouseId_dto_1 = require("./dto/warehouseId.dto");
const warehouseAddress_dto_1 = require("./dto/warehouseAddress.dto");
const data_mapper_1 = require("./data.mapper");
const warehouseId_entity_1 = require("./../domain/warehouseId.entity");
let RoutingController = class RoutingController {
    routingService;
    constructor(routingService) {
        this.routingService = routingService;
    }
    async updateAddress(address, context) {
        try {
            const warehouseId = context.getSubject().split('.')[3];
            const domainAddress = data_mapper_1.DataMapper.warehouseAddressToDomain(address);
            return await this.routingService.updateWarehouseAddress(new warehouseId_entity_1.WarehouseId(Number(warehouseId)), domainAddress.getAddress());
        }
        catch (error) {
            return Promise.resolve(JSON.stringify({
                error: {
                    code: "system.invalidParams",
                    message: error.message
                }
            }));
        }
    }
    async removeAddress(address) {
        try {
            const domainAddress = data_mapper_1.DataMapper.warehouseAddressToDomain(address);
            return await this.routingService.removeWarehouseAddress(domainAddress.getWarehouseState().getId());
        }
        catch (error) {
            return Promise.resolve(JSON.stringify({
                error: {
                    code: "system.invalidParams",
                    message: error.message
                }
            }));
        }
    }
    async receiveRequest(payload) {
        console.log('Received payload in receiveRequest:', payload);
        try {
            const warehouseId = new warehouseId_dto_1.WarehouseIdDTO();
            warehouseId.warehouseId = payload.warehouseId;
            const domainId = data_mapper_1.DataMapper.warehouseIdToDomain(warehouseId);
            console.log('Payload received in receiveRequest:', domainId);
            const warehouses = await this.routingService.calculateDistance(domainId);
            console.log('Received warehouseId:', warehouseId);
            console.log('DomainId:', domainId);
            console.log('Calculated warehouses:', warehouses);
            return Promise.resolve(JSON.stringify({ result: { warehouses } }));
        }
        catch (error) {
            return Promise.resolve(JSON.stringify({
                error: {
                    code: "system.invalidParams",
                    message: error.message
                }
            }));
        }
    }
    async updateWarehouseState(payload) {
        console.log('Received warehouseState DTO:', payload);
        try {
            const domainState = data_mapper_1.DataMapper.warehouseStateToDomain(payload);
            return await this.routingService.updateWarehouseState(domainState.getId(), domainState.getState());
        }
        catch (error) {
            return Promise.resolve(JSON.stringify({
                error: {
                    code: "system.invalidParams",
                    message: error.message
                }
            }));
        }
    }
    async createWarehouse(dto) {
        try {
            return await this.routingService.saveWarehouse(dto.state, dto.address);
        }
        catch (error) {
            return Promise.resolve(JSON.stringify({
                error: {
                    code: "system.invalidParams",
                    message: error.message
                }
            }));
        }
    }
};
exports.RoutingController = RoutingController;
__decorate([
    (0, microservices_1.MessagePattern)(`call.routing.warehouse.*.address.set`),
    __param(0, (0, microservices_1.Payload)('params')),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [warehouseAddress_dto_1.WarehouseAddressDTO, Object]),
    __metadata("design:returntype", Promise)
], RoutingController.prototype, "updateAddress", null);
__decorate([
    (0, microservices_1.MessagePattern)(`call.routing.warehouse.${process.env.WAREHOUSE_ID}.address.delete`),
    __param(0, (0, microservices_1.Payload)('params')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [warehouseAddress_dto_1.WarehouseAddressDTO]),
    __metadata("design:returntype", Promise)
], RoutingController.prototype, "removeAddress", null);
__decorate([
    (0, microservices_1.MessagePattern)(`call.routing.warehouse.*.receiveRequest.set`),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutingController.prototype, "receiveRequest", null);
__decorate([
    (0, microservices_1.MessagePattern)(`call.routing.warehouse.*.warehouseState.set`),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutingController.prototype, "updateWarehouseState", null);
__decorate([
    (0, microservices_1.MessagePattern)('call.routing.warehouse.create'),
    __param(0, (0, microservices_1.Payload)('params')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoutingController.prototype, "createWarehouse", null);
exports.RoutingController = RoutingController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [routing_service_1.RoutingService])
], RoutingController);
//# sourceMappingURL=routing.controller.js.map