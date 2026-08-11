import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { OutboundPortsAdapter } from './outboundPortAdapters';
import { StateEventHandler } from '../../../../core/application/state/event-handler/state-event.handler';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo';
import { WarehouseState } from '../../../../core/domain/state/entities/warehouse-state.entity';
import { Heartbeat } from '../../../../core/domain/state/entities/heartbeat.entity';
import { DataMapper } from '../../../../infrastructure/mappers/state-datamapper';
import { HeartbeatDTO } from '../../../../core/application/state/dto/heartbeat.dto';

describe('OutboundPortsAdapter', () => {
  let adapter: OutboundPortsAdapter;
  let stateEvent: Partial<StateEventHandler>;

  beforeEach(async () => {
    stateEvent = {
      publishState: jest.fn().mockResolvedValue(undefined),
      publishHeartbeat: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OutboundPortsAdapter,
        { provide: StateEventHandler, useValue: stateEvent },
      ],
    }).compile();

    adapter = module.get<OutboundPortsAdapter>(OutboundPortsAdapter);
  });

  it('should publish warehouse state', async () => {
    const warehouseId = new WarehouseId(1);
    const state = new WarehouseState('ACTIVE');

    await adapter.publishState(warehouseId, state);

    expect(stateEvent.publishState).toHaveBeenCalledWith(warehouseId, state);
  });

  it('should publish heartbeat with DTO', async () => {
    const warehouseId = new WarehouseId(2);
    const heartbeat = new Heartbeat(warehouseId,'ALIVE', new Date());

    // Spy su DataMapper
    jest.spyOn(DataMapper, 'toDTOHeartbeat');

    await adapter.publishHeartbeat(heartbeat);

    expect(DataMapper.toDTOHeartbeat).toHaveBeenCalledWith(heartbeat);
    expect(stateEvent.publishHeartbeat).toHaveBeenCalledWith(expect.any(HeartbeatDTO));

    const dtoArg = (stateEvent.publishHeartbeat as jest.Mock).mock.calls[0][0] as HeartbeatDTO;
    expect(dtoArg.heartbeatMsg).toBe('ALIVE');
    expect(dtoArg.warehouseId).toBe(warehouseId.getId());
    expect(dtoArg.timestamp).toBeInstanceOf(Date);
  });

  it('should log error when publishState fails', async () => {
    const warehouseId = new WarehouseId(1);
    const state = new WarehouseState('ACTIVE');

    (stateEvent.publishState as jest.Mock).mockRejectedValueOnce(new Error('fail'));

    const loggerSpy = jest.spyOn(adapter['logger'], 'error');

    await adapter.publishState(warehouseId, state);

    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to publish warehouse state'));
  });

  it('should log error when publishHeartbeat fails', async () => {
    const warehouseId = new WarehouseId(1);
    const heartbeat = new Heartbeat(warehouseId,'ALIVE', new Date());

    (stateEvent.publishHeartbeat as jest.Mock).mockRejectedValueOnce(new Error('fail'));

    const loggerSpy = jest.spyOn(adapter['logger'], 'error');

    await adapter.publishHeartbeat(heartbeat);

    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to publish warehouse state'));
  });
});
