import { Test, TestingModule } from '@nestjs/testing';
import { GdriveService } from './api.service';
import { GdriveauthService } from './auth.service';

const { Polly } = require('@pollyjs/core');
const { setupPolly } = require('setup-polly-jest');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const path = require('path');

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);
describe('GdriveService', () => {
  setupPolly({
    adapters: ['node-http'],
    persister: 'fs',
    logging: false,
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(__dirname, '../../test/__recordings__'),
      },
    },
  });

  let service: GdriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GdriveService, GdriveauthService],
    }).compile();

    service = module.get<GdriveService>(GdriveService);
  });

  it('should successfully return a list of files', async () => {
    const files = await service.getFiles();
    const partialResponse = [
      {
        id: '1VL3GqkwWWjXuK6MHGxGq81sOf0GJRr8Gxn5dlcHBXVk',
        name: 'cs jobs',
      },
      {
        id: '1C2tPx8KsBeGT0kEawbZcLLML_7Q4bmnRBWSEgwyEoxc',
        name: 'Copy of Coronavirus – When Should You Close Your Office?',
      },
    ];
    expect(files).toEqual(expect.arrayContaining(partialResponse));
    expect(files.length).toEqual(100);
  });
});
