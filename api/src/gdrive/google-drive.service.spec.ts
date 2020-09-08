import { Test, TestingModule } from '@nestjs/testing';
import { setupRecorder } from 'nock-record';
import { GoogleDriveService } from './google-drive.service';
import { OAuthClientService } from './oauth-client.service';
import { writeToFile } from '../utils/common';
import * as fs from 'fs';
import { google } from 'googleapis';
import * as os from 'os';
import nock = require('nock');

const path = require('path');

describe('googleDriveService', () => {
  const record = setupRecorder();

  let service: GoogleDriveService;

  beforeEach(async () => {
    nock.enableNetConnect();
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleDriveService, OAuthClientService],
    }).compile();

    service = module.get<GoogleDriveService>(GoogleDriveService);
  });
  afterEach(async () => {
    const credsPath = process.env.GOOGLE_DRIVE_CREDENTIALS_PATH;
    if (await fs.existsSync(credsPath)) fs.unlinkSync(credsPath);
  });

  describe('When google drive credentials are already set', () => {
    beforeAll(async () => {
      await writeToFile(process.env.GOOGLE_DRIVE_CREDENTIALS_PATH, {
        access_token:
          'ya29.a0AfH6SMDv0YoXM_uuxnIZDWRENEgLQ6hPz-2ZPPaHKSPONjmU0IE3Y533D1LkuJXIDvwSn4dgAXh0zBY6c23SB4enFMF3Ioz3Jm1SROvJ03hYoy58jFT7KielqkjOIerr6OsZ6FzL0KlWgJ4cVQa1CGB_2RowCHr0AcI',
        refresh_token:
          '1//0fSRmN81hi2hgCgYIARAAGA8SNwF-L9IrsRHMKClkKcTOe4kYW7WR0UFI3VmZaH8qgACE0IaBLpe7ZktMpMOE-fSs6t3WbOIjAcQ',
        scope: 'https://www.googleapis.com/auth/drive',
        token_type: 'Bearer',
        expiry_date: 1593898438789,
      });
    });

    it.only('.processDownloads with completed downloads', async () => {
      await writeToFile(
        path.resolve(
          os.homedir() +
            `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/complete/test.mp3`,
        ),
        { data: 'test' },
      );
      const partialResponse = [
        {
          id: '1_s-pmAg_jaK7FNrxUfBspkuGye7KwPfd',
          name: 'The Border - 19.mp3',
        },
        {
          id: '1kFWlV8uZnuId7YQTVGyO5YYjNrj2E5GV',
          name: 'The Border - 16.mp3',
        },
      ];

      const { completeRecording, assertScopesFinished } = await record(
        'process-downloads',
      );

      const files = await service.processDownloads();
      completeRecording();
      assertScopesFinished();

      expect(files).toEqual(expect.arrayContaining(partialResponse));
    });

    it('.files', async () => {
      const partialResponse = [
        {
          id: '1_s-pmAg_jaK7FNrxUfBspkuGye7KwPfd',
          name: 'The Border - 19.mp3',
        },
        {
          id: '1kFWlV8uZnuId7YQTVGyO5YYjNrj2E5GV',
          name: 'The Border - 16.mp3',
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

    it('.findFolder if exists', async () => {
      const { completeRecording, assertScopesFinished } = await record(
        'find-google-drive-folder',
      );

      const folder = await service.findFolder();
      completeRecording();
      assertScopesFinished();

      expect(folder).toEqual({
        id: '1a7y0zs7BwiHXtqhQgaAMXWCZ0FnPs3bK',
        name: 'AudioBooks',
      });
    });

    it('.findFolder if does not exist', async () => {
      const { completeRecording, assertScopesFinished } = await record(
        'find-google-drive-folder',
      );

      expect(service.findFolder('bad-folder')).rejects.toThrow(
        'Unable to find google drive folder bad-folder',
      );
    });
  });

  describe('When google drive credentials are not set', () => {
    it('should return an error', async () => {
      expect(service.getFiles()).rejects.toThrow(
        'Google Drive client is not authenticated',
      );
    });
  });
});
