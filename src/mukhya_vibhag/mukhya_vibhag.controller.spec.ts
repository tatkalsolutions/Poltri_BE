import { Test, TestingModule } from '@nestjs/testing';
import { MukhyaVibhagController } from './mukhya_vibhag.controller';

describe('MukhyaVibhagController', () => {
  let controller: MukhyaVibhagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MukhyaVibhagController],
    }).compile();

    controller = module.get<MukhyaVibhagController>(MukhyaVibhagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
