import { Test, TestingModule } from '@nestjs/testing';
import { TransmissionController } from './transmission.controller';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { EventEmitterService } from '../utils/event-emitter.service';
import { TransmissionModule } from './transmission.module';
import { AppModule } from '../app.module';

describe('Transmission Controller', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', async () => {
    const response = await request(app.getHttpServer()).get(
      '/transmission/completed',
    );
    console.log(`response`, response.body);
    expect(response).toEqual(true);
  });
});
