import { Test, TestingModule } from '@nestjs/testing';
import { GdriveAuthService } from './auth.service';
import { setupRecorder } from 'nock-record';

const record = setupRecorder();

describe('GdriveAuthService', () => {
  let service: GdriveAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GdriveAuthService],
    }).compile();

    service = module.get<GdriveAuthService>(GdriveAuthService);
  });

  const expectedClientConfig = {
    client_id:
      '780470202475-k4t146ff6bopjgekimobn82v6haqiv7f.apps.googleusercontent.com',
    client_secret: '4Kt0KEMNBfowkstThkcJq2RO',
    redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', ' http://localhost'],
  };

  const expectedAuthUrl =
    'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=780470202475-k4t146ff6bopjgekimobn82v6haqiv7f.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob';

  it('Should set config from env vars', () => {
    const config = service.googleConfig;
    expect(config).toEqual(expectedClientConfig);
  });

  it('generate url to request token', () => {
    const authUrl = service.urlForValidationCode();
    expect(authUrl).toEqual(expectedAuthUrl);
  });

  it.only('accepts validation code and returns access token object', async () => {
    const { completeRecording, assertScopesFinished } = await record(
      'validation-code-return-token',
    );
    const oAuthClient = service.createOAuthGoogleClient();
    const validationCode =
      '4/xgFkGNSr-JecF0LtdgvCZTPxLJkn1p1HVeXNjRVYoM0CV1i-ShN_cDc';
    const tokenObject = await oAuthClient.getToken(validationCode);
    completeRecording();
    assertScopesFinished();

    expect(JSON.stringify(tokenObject)).toMatch(
      /ya29.a0Adw1xeXzRkJ3d5MYJu4s8yeD7GLliCAefjlKjf_ZzyVEAYMp4r0D0uBNQxXNNJXDNsdnE8s23vp39EKD6lOBvpEbq6b2LnhhDBfPwZdLyUH5-JqM2M22qTG1GQu9vqXhGnUrqaE_49FOfpwopWDamOlw1NzPPKWvDkQ/,
    );
  });

  it('isClientAuthorized returns true when client is authorized', async () => {
    const authorized = await service.isClientAuthorized();
    expect(authorized).toEqual(true);
  });

  it('isClientAuthorized returns false when client is not authorized', async () => {
    process.env.GOOGLE_DRIVE_CREDENTIALS_PATH = 'invalidpath';
    const authorized = await service.isClientAuthorized();
    console.log('Auth', authorized);
    expect(authorized).toEqual(false);
  });
});
