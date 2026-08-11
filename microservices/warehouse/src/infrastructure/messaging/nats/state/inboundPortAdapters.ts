import { Injectable } from "@nestjs/common";

import { StateService } from "../../../../core/application/state/state.service";
import { DataMapper } from "../../../../infrastructure/mappers/state-datamapper";
import { GetStateEventListener } from "../../../../core/application/state/ports/getState.listener";
import { WarehouseState } from "../../../../core/domain/state/entities/warehouse-state.entity";
import { WarehouseIdDTO } from "../../../../core/application/state/dto/warehouse-id.dto";


@Injectable()
export class InboundPortsAdapter implements GetStateEventListener {
  constructor(
    private readonly stateService: StateService,
  ) {}

  async getSyncedState(warehouseIdDTO: WarehouseIdDTO): Promise<void> {
    const warehouseId = DataMapper.toDomainWarehouseId(warehouseIdDTO)
    //this.stateService.sendHeartBeat(warehouseId, new WarehouseState("Attivo"));
    this.stateService.sendHeartBeat(warehouseId, new WarehouseState("ONLINE"));
  /*
  if (!warehouseState) {
    
    return { warehouseId : {id : 1} ,state: 'unknown' }; 
  }

  const warehouseId = DataMapper.toDomainWarehouseId(warehouseIdDTO);
  const heartbeat = new Heartbeat('ALIVE', new Date(), warehouseId);

  await this.stateEvenntHandler.publishHeartbeat(heartbeat);
  */
  }
}

