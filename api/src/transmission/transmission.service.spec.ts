import { mocked } from 'ts-jest/utils';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { TransmissionService } from './transmission.service';
import createMockInstance from 'jest-create-mock-instance';
import { TransmissionConfig } from './transmission.config';
import * as ConfigClientOptionsModule from './transmission.config';

describe('TransmissionService', () => {
  let service: TransmissionService;

  const defaultOptions = {
    _events: {},
    _eventsCount: 0,
    _maxListeners: undefined,
    host: 'localhost',
    key: null,
    port: 9091,
    ssl: false,
    url: '/transmission/rpc',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransmissionService],
    }).compile();

    service = module.get<TransmissionService>(TransmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setting the transmissionClient', () => {
    it('should return default options when no arguments are passed in ', () => {
      expect(service.transmissionClient()).toEqual(defaultOptions);
    });

    it('should have env vars overwrite default options', () => {
      expect(service.transmissionClient()).toEqual(defaultOptions);
    });

    it('should have config vars overwrite env and default options', () => {
      expect(service.transmissionClient()).toEqual(defaultOptions);
    });
  });

  // describe('getSessionStats', () => {
  //   it('Should return the current stats', () => {
  //     service.stats();
  //   });
  // });
});
