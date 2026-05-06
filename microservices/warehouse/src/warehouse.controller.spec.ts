import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';

describe('WarehouseController', () => {
  let warehouseController: WarehouseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseController],
      providers: [WarehouseService],
    }).compile();

    warehouseController = app.get<WarehouseController>(WarehouseController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(warehouseController.getHello()).toBe('Hello World!');
    });
  });
});
