"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const routing_module_1 = require("./application/routing.module");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const common_1 = require("@nestjs/common");
const outbound_response_serializer_1 = require("./interfaces/nats/natsMessagesFormatters/outbound-response.serializer");
const inbound_response_deserializer_1 = require("./interfaces/nats/natsMessagesFormatters/inbound-response.deserializer");
const logger = new common_1.Logger();
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(routing_module_1.RoutingModule, {
        logger: logger,
        transport: microservices_1.Transport.NATS,
        options: {
            servers: ['nats://nats:4222'],
            deserializer: new inbound_response_deserializer_1.InboundResponseDeserializer(),
            serializer: new outbound_response_serializer_1.OutboundResponseSerializer(),
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ exceptionFactory: (errors) => new microservices_1.RpcException(errors) }));
    await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map