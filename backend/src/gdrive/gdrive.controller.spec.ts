import { Test, TestingModule } from '@nestjs/testing';
import { GdriveController } from './gdrive.controller';
import { INestApplication } from '@nestjs/common';
import { GdriveService } from './google-drive.service';

describe('Gdrive Controller', () => {
  let controller: GdriveController;
  let gdriveService: GdriveService;

  beforeEach(async () => {
    let app: INestApplication;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GdriveController],
      providers: [GdriveService],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    controller = module.get<GdriveController>(GdriveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
