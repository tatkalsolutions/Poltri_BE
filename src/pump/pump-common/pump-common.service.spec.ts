import { Test, TestingModule } from '@nestjs/testing';
import { PumpCommonService } from './pump-common.service';

describe('PumpCommonService', () => {
  let service: PumpCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PumpCommonService],
    }).compile();

    service = module.get<PumpCommonService>(PumpCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
