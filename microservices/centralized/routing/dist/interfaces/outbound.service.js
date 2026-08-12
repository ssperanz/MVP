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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboundService = void 0;
const common_1 = require("@nestjs/common");
const nats_service_1 = require("./../interfaces/nats/nats.service");
let OutboundService = class OutboundService {
    natsService;
    constructor(natsService) {
        this.natsService = natsService;
    }
    async sendAddress(address) {
        await this.natsService.publish("warehouse.address", address);
    }
    async sendWarehouseDistance(warehouseId) {
        await this.natsService.publish("warehouse.distance", [warehouseId]);
    }
    async sendWarehouseAndState(warehouseState) {
        await this.natsService.publish("warehouse.state", warehouseState);
    }
};
exports.OutboundService = OutboundService;
exports.OutboundService = OutboundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nats_service_1.NatsService])
], OutboundService);
//# sourceMappingURL=outbound.service.js.map