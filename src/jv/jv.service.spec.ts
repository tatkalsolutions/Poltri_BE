import { Test, TestingModule } from '@nestjs/testing';
import { JvService } from './jv.service';

describe('JvService', () => {
  let service: JvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JvService],
    }).compile();

    service = module.get<JvService>(JvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
