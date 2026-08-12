"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.natsConfig = void 0;
const microservices_1 = require("@nestjs/microservices");
exports.natsConfig = {
    transport: microservices_1.Transport.NATS,
    options: {
        servers: [process.env.NATS_URL || 'nats://localhost:4222'],
        queue: 'orders-queue',
        timeout: 5000,
        maxReconnectAttempts: -1,
        reconnect: true,
        reconnectTimeWait: 1000,
    },
};
//# sourceMappingURL=nats.config.js.map