import { Test, TestingModule } from '@nestjs/testing';
import { GdriveController } from './gdrive.controller';

describe('Gdrive Controller', () => {
  let controller: GdriveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GdriveController],
    }).compile();

    controller = module.get<GdriveController>(GdriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
