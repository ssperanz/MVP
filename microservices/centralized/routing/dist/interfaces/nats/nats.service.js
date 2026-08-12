"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatsService = void 0;
const common_1 = require("@nestjs/common");
const nats_1 = require("nats");
let NatsService = class NatsService {
    nc;
    jsonCodec = (0, nats_1.JSONCodec)();
    async onModuleInit() {
        this.nc = await (0, nats_1.connect)({
            servers: process.env.NATS_URL || 'nats://nats:4222'
        });
    }
    async onModuleDestroy() {
        await this.nc?.close();
    }
    async publish(subject, data) {
        this.nc.publish(subject, this.jsonCodec.encode(data));
    }
};
exports.NatsService = NatsService;
exports.NatsService = NatsService = __decorate([
    (0, common_1.Injectable)()
], NatsService);
//# sourceMappingURL=nats.service.js.map