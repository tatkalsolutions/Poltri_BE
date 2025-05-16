import { Test, TestingModule } from '@nestjs/testing';
import { MukhyaVibhagService } from './mukhya_vibhag.service';

describe('MukhyaVibhagService', () => {
  let service: MukhyaVibhagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MukhyaVibhagService],
    }).compile();

    service = module.get<MukhyaVibhagService>(MukhyaVibhagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
