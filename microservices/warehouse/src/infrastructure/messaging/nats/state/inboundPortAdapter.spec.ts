// src/infrastructure/adapters/portAdapters/inboundPortsAdapter.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InboundPortsAdapter } from './inboundPortAdapters';
import { StateService } from '../../../../core/application/state/state.service';
import { DataMapper } from '../../../../infrastructure/mappers/state-datamapper';
import { WarehouseIdDTO } from '../../../../core/application/state/dto/warehouse-id.dto';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo';
import { WarehouseState } from '../../../../core/domain/state/entities/warehouse-state.entity';

describe('InboundPortsAdapter', () => {
  let adapter: InboundPortsAdapter;
  let stateService: Partial<StateService>;

  beforeEach(async () => {
    stateService = {
      sendHeartBeat: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InboundPortsAdapter,
        { provide: StateService, useValue: stateService },
      ],
    }).compile();

    adapter = module.get<InboundPortsAdapter>(InboundPortsAdapter);
  });

  it('should call sendHeartBeat with correct domain objects', async () => {
    const warehouseIdDTO: WarehouseIdDTO = { id: 1 };
    const domainWarehouseId = new WarehouseId(1);

    // Mock DataMapper
    jest.spyOn(DataMapper, 'toDomainWarehouseId').mockReturnValue(domainWarehouseId);

    await adapter.getSyncedState(warehouseIdDTO);

    expect(DataMapper.toDomainWarehouseId).toHaveBeenCalledWith(warehouseIdDTO);
    expect(stateService.sendHeartBeat).toHaveBeenCalledWith(domainWarehouseId, expect.any(WarehouseState));
    
    const sentState = (stateService.sendHeartBeat as jest.Mock).mock.calls[0][1];
    expect(sentState.getState()).toBe('ONLINE');
  });
});
