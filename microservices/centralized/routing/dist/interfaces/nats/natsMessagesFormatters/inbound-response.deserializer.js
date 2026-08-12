"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundResponseDeserializer = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
class InboundResponseDeserializer {
    logger = new common_1.Logger('InboundResponseDeserializer');
    deserialize(value, options) {
        this.logger.verbose(`<<-- deserializing inbound response message:\n${value}
      \n\twith options: ${JSON.stringify(options)}`);
        return {
            pattern: undefined,
            data: JSON.parse(value),
            id: (0, uuid_1.v4)(),
        };
    }
}
exports.InboundResponseDeserializer = InboundResponseDeserializer;
//# sourceMappingURL=inbound-response.deserializer.js.map