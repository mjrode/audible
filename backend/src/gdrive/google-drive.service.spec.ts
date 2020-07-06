import { Test, TestingModule } from '@nestjs/testing';
import { GdriveService } from './google-drive.service';
import { GdriveAuthService } from './auth.service';
import { setupRecorder } from 'nock-record';

const path = require('path');

describe('GdriveService', () => {
  const record = setupRecorder();

  let service: GdriveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GdriveService, GdriveAuthService],
    }).compile();

    service = module.get<GdriveService>(GdriveService);
  });

  it('should successfully return a list of files', async () => {
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

    const { completeRecording, assertScopesFinished } = await record(
      'return-list-of-files',
    );

    const files = await service.getFiles();
    completeRecording();
    assertScopesFinished();

    expect(files).toEqual(expect.arrayContaining(partialResponse));
    expect(files.length).toEqual(100);
  });
});
