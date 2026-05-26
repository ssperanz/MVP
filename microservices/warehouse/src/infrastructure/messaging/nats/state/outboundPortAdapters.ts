import { Injectable, Logger } from '@nestjs/common';
import { StateEventHandler } from 'src/core/application/state/event-handler/state-event.handler';
import { StatePortPublisher } from 'src/core/application/state/ports/sendHeartBeatPort';
import { Heartbeat } from 'src/core/domain/state/entities/heartbeat.entity';
import { WarehouseState } from 'src/core/domain/state/entities/warehouse-state.entity';
import { DataMapper } from 'src/infrastructure/mappers/state-datamapper';
import { WarehouseId } from 'src/shared/domain/value-objects/warehouse-id.vo';

@Injectable()
export class OutboundPortsAdapter implements StatePortPublisher {
  private readonly logger = new Logger(OutboundPortsAdapter.name);

  constructor(
    private readonly stateEvent : StateEventHandler
  ) {}

  async publishState(warehouseId : WarehouseId, state: WarehouseState): Promise<void> {
    try {
      this.logger.log(`Publishing state for warehouse: ${state.getState()}`);
      await this.stateEvent.publishState(warehouseId, state); 
    } catch (error) {
    const e = error as Error;
    this.logger.error(`Failed to publish warehouse state: ${e.message}`);
    }
  }

    async publishHeartbeat(heartbeat : Heartbeat): Promise<void> {
    console.log(`Publishing heartbeat for warehouse: ${JSON.stringify(heartbeat)}`);
    const heartbeatDto = DataMapper.toDTOHeartbeat(heartbeat);
    try {
      await this.stateEvent.publishHeartbeat(heartbeatDto); 
    } catch (error) {
    const e = error as Error;
    this.logger.error(`Failed to publish warehouse state: ${e.message}`);
    }
  }
}