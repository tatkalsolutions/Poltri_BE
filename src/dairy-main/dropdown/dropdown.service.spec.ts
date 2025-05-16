import { Test, TestingModule } from '@nestjs/testing';
import { DropdownService } from './dropdown.service';

describe('DropdownService', () => {
  let service: DropdownService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DropdownService],
    }).compile();

    service = module.get<DropdownService>(DropdownService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
