import { Test, TestingModule } from '@nestjs/testing';
import { PashukhayavibhagcommonService } from './pashukhayavibhagcommon.service';

describe('PashukhayavibhagcommonService', () => {
  let service: PashukhayavibhagcommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PashukhayavibhagcommonService],
    }).compile();

    service = module.get<PashukhayavibhagcommonService>(PashukhayavibhagcommonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
