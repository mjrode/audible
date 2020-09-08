import { Test, TestingModule } from '@nestjs/testing';
import { GdriveController } from './gdrive.controller';
import { INestApplication } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import * as request from 'supertest';

describe('Gdrive Controller', () => {
  let controller: GdriveController;

  beforeEach(async () => {
    let app: INestApplication;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GdriveController],
      providers: [GoogleDriveService],
    }).compile();
    app = module.createNestApplication();
    controller = module.get<GdriveController>(GdriveController);
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/GET authorized', () => {
    describe('If the google credentials are valid', () => {
      it('should return a 200 and true', async () => {
        // const { completeRecording, assertScopesFinished } = await record(
        // 'get-authorized-status',
        // );
        const response = await request(this.app.getHttpServer()).get(
          '/api/gdrive/authorized',
        );

        console.log(`response`, response.body);
        // completeRecording();
        // assertScopesFinished();
        expect(response).toEqual(false);
      });
    });
  });
});
