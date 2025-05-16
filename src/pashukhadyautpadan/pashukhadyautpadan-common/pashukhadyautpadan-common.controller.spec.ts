import { Test, TestingModule } from '@nestjs/testing';
import { PashukhadyautpadanCommonController } from './pashukhadyautpadan-common.controller';

describe('PashukhadyautpadanCommonController', () => {
  let controller: PashukhadyautpadanCommonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PashukhadyautpadanCommonController],
    }).compile();

    controller = module.get<PashukhadyautpadanCommonController>(PashukhadyautpadanCommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
