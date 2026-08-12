"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboundResponseSerializer = void 0;
const common_1 = require("@nestjs/common");
class OutboundResponseSerializer {
    logger = new common_1.Logger(OutboundResponseSerializer.name);
    serialize(value) {
        this.logger.verbose(`-->> Serializing outbound response: \n${JSON.stringify(value)}`);
        if (value.response) {
            value = { data: value.response };
        }
        else if (value.err) {
            const message = Array.isArray(value.err)
                ? value.err
                    .flatMap((err) => (err.constraints ? Object.values(err.constraints) : []))
                    .join('. ')
                : value.err;
            value = {
                data: JSON.stringify({
                    error: {
                        code: 'system.invalidParams',
                        message: message
                    }
                })
            };
        }
        this.logger.verbose(`-->> Serialized outbound response: \n${value.data}`);
        return value;
    }
}
exports.OutboundResponseSerializer = OutboundResponseSerializer;
//# sourceMappingURL=outbound-response.serializer.js.map