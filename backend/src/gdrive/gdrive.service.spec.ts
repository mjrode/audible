import { Test, TestingModule } from '@nestjs/testing';
import { GdriveService } from './gdrive.service';
const path = require('path');

const { Polly } = require('@pollyjs/core');
const { setupPolly } = require('setup-polly-jest');
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

describe('GdriveService', () => {
  let service: GdriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GdriveService],
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

  it('Should return a url for the client to authenticate google drive', async () => {
    const url = await service.urlForRequestToken();
    const googleUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=780470202475-k4t146ff6bopjgekimobn82v6haqiv7f.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob';
    expect(url).toEqual(googleUrl);
  });
});
