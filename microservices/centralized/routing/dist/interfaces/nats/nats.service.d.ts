import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class NatsService implements OnModuleInit, OnModuleDestroy {
    private nc;
    private jsonCodec;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    publish(subject: string, data: any): Promise<void>;
}
