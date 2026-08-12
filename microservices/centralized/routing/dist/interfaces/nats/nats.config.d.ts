import { Transport } from '@nestjs/microservices';
export declare const natsConfig: {
    transport: Transport;
    options: {
        servers: string[];
        queue: string;
        timeout: number;
        maxReconnectAttempts: number;
        reconnect: boolean;
        reconnectTimeWait: number;
    };
};
