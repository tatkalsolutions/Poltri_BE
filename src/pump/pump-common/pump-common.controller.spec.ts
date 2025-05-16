import { Test, TestingModule } from '@nestjs/testing';
import { PumpCommonController } from './pump-common.controller';

describe('PumpCommonController', () => {
  let controller: PumpCommonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PumpCommonController],
    }).compile();

    controller = module.get<PumpCommonController>(PumpCommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
