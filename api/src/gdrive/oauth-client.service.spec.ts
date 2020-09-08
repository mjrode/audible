import { Test, TestingModule } from '@nestjs/testing';
import { setupRecorder } from 'nock-record';
import { OAuthClientService } from './oauth-client.service';
import * as fs from 'fs';

const record = setupRecorder();

describe('OAuthClientService', () => {
  let oAuthClientService: OAuthClientService;
  // jest.mock('fs');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OAuthClientService],
    }).compile();

    oAuthClientService = module.get<OAuthClientService>(OAuthClientService);
  });

  afterEach(async () => {
    const credsPath = process.env.GOOGLE_DRIVE_CREDENTIALS_PATH;
    if (await fs.existsSync(credsPath)) fs.unlinkSync(credsPath);
  });

  it('Instantiates a new instance of OAuthClientService', () => {
    const expectedResponse =
      '{"oAuthClient":{"_events":{},"_eventsCount":0,"transporter":{},"credentials":{},"certificateCache":{},"certificateExpiry":null,"certificateCacheFormat":"PEM","refreshTokenPromises":{},"_clientId":"749522153528-52g5t6ai71qvpq6mmi603uffq4ajso3h.apps.googleusercontent.com","_clientSecret":"V28IbVJjRp-dGU0WzewH7e8M","redirectUri":"urn:ietf:wg:oauth:2.0:oob","eagerRefreshThresholdMillis":300000}}';

    expect(JSON.stringify(oAuthClientService)).toEqual(expectedResponse);
  });

  describe('When google drive credentials are already set', () => {
    let googleDriveCredentials;
    beforeEach(async () => {
      googleDriveCredentials = {
        access_token:
          'ya29.a0AfH6SMDv0YoXM_uuxnIZDWRENEgLQ6hPz-2ZPPaHKSPONjmU0IE3Y533D1LkuJXIDvwSn4dgAXh0zBY6c23SB4enFMF3Ioz3Jm1SROvJ03hYoy58jFT7KielqkjOIerr6OsZ6FzL0KlWgJ4cVQa1CGB_2RowCHr0AcI',
        refresh_token:
          '1//0fSRmN81hi2hgCgYIARAAGA8SNwF-L9IrsRHMKClkKcTOe4kYW7WR0UFI3VmZaH8qgACE0IaBLpe7ZktMpMOE-fSs6t3WbOIjAcQ',
        scope: 'https://www.googleapis.com/auth/drive',
        token_type: 'Bearer',
        expiry_date: 1593898438789,
      };
      await fs.writeFileSync(
        process.env.GOOGLE_DRIVE_CREDENTIALS_PATH,
        JSON.stringify(googleDriveCredentials),
      );
    });

    it('returns an authenticated client', async () => {
      const response = await oAuthClientService.googleClient();
      expect(JSON.stringify(response.credentials)).toMatch(
        JSON.stringify(googleDriveCredentials),
      );
    });
  });

  describe('When google drive credentials are not set', () => {
    it('returns an error', async () => {
      expect(oAuthClientService.googleClient()).rejects.toThrow(
        'Google Drive client is not authenticated',
      );
    });
  });

  describe('When authenticating the google drive client', () => {
    it('returns a url to fetch a token', () => {
      const response = oAuthClientService.getUrlForNewToken();

      expect(response).toMatch(
        'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope',
      );
    });

    describe('When using a valid token', () => {
      it('returns google drive credentials', async () => {
        const { completeRecording, assertScopesFinished } = await record(
          'token-returns-new-credentials',
        );
        const response = await oAuthClientService.generateAuthCredentials(
          '4/1gHUPTsV5UYufT2DCZX_5m9rDJEvWDJB7vd0-HsIlAleUhQ4n5qy3XA',
        );
        completeRecording();
        assertScopesFinished();

        expect(response.credentials.tokens.access_token).toMatch(
          `ya29.a0AfH6SMDrT3DHlCHsk1EtxT32ga_5_XiaNV6smrym1WlUqwaSY6iIpgHZHWLUbruG8V9O-1Jg0R1nV2LaTjV723YC0owOv4A24Vk22UUQgIh29pIqGxqA67gVRJN3bX3vMaZBw2hU62oy5LaXnpLh75MPtjIG8xPZdAM`,
        );
      });
    });

    describe('When using an invalid token', () => {
      it('returns google drive credentials', async () => {
        const { completeRecording, assertScopesFinished } = await record(
          'invalid-token-returns-error',
        );
        const response = await oAuthClientService.generateAuthCredentials(
          'invalidToken',
        );
        completeRecording();
        assertScopesFinished();

        expect(JSON.stringify(response)).toMatch(
          '{"status":400,"error":"invalid_grant","error_description":"Malformed auth code."}',
        );
      });
    });
  });
});
