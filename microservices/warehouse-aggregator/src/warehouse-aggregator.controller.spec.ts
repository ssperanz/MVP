import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseAggregatorController } from './warehouse-aggregator.controller';
import { WarehouseAggregatorService } from './warehouse-aggregator.service';

describe('WarehouseAggregatorController', () => {
  let warehouseAggregatorController: WarehouseAggregatorController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseAggregatorController],
      providers: [WarehouseAggregatorService],
    }).compile();

    warehouseAggregatorController = app.get<WarehouseAggregatorController>(WarehouseAggregatorController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(warehouseAggregatorController.getHello()).toBe('Hello World!');
    });
  });
});
