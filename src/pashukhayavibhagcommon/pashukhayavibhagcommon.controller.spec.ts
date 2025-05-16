import { Test, TestingModule } from '@nestjs/testing';
import { PashukhayavibhagcommonController } from './pashukhayavibhagcommon.controller';

describe('PashukhayavibhagcommonController', () => {
  let controller: PashukhayavibhagcommonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PashukhayavibhagcommonController],
    }).compile();

    controller = module.get<PashukhayavibhagcommonController>(PashukhayavibhagcommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
