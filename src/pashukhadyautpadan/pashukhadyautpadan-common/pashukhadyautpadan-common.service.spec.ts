import { Test, TestingModule } from '@nestjs/testing';
import { PashukhadyautpadanCommonService } from './pashukhadyautpadan-common.service';

describe('PashukhadyautpadanCommonService', () => {
  let service: PashukhadyautpadanCommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PashukhadyautpadanCommonService],
    }).compile();

    service = module.get<PashukhadyautpadanCommonService>(PashukhadyautpadanCommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
