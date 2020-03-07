import { Test, TestingModule } from '@nestjs/testing';
import { GdriveService } from './gdrive.service';

describe('GdriveService', () => {
  let service: GdriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GdriveService],
    }).compile();

    service = module.get<GdriveService>(GdriveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
