import { Heartbeat } from './heartbeat.entity';
import { WarehouseId } from '../../../../shared/domain/value-objects/warehouse-id.vo';
import { WarehouseState } from './warehouse-state.entity';

describe('Entities', () => {
  it('should create a Heartbeat entity', () => {
    const warehouseId = new WarehouseId(1);
    const heartbeat = new Heartbeat(warehouseId, 'ALIVE', new Date());

    expect(heartbeat.getHeartbeatMsg()).toBe('ALIVE');
    expect(heartbeat.getId()).toBe(1);
  });

  it('should create a WarehouseState entity', () => {
    const state = new WarehouseState('ACTIVE');

    expect(state.getState()).toBe('ACTIVE');

    state.setState('INACTIVE');
    expect(state.getState()).toBe('INACTIVE');
  });

  it('should create a WarehouseId entity', () => {
    const warehouseId = new WarehouseId(42);
    expect(warehouseId.getId()).toBe(42);
  });
});