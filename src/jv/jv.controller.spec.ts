import { Test, TestingModule } from '@nestjs/testing';
import { JvController } from './jv.controller';
import { JvService } from './jv.service';

describe('JvController', () => {
  let controller: JvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JvController],
      providers: [JvService],
    }).compile();

    controller = module.get<JvController>(JvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
