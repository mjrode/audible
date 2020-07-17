import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { writeToFile } from '../utils/common';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

@Injectable()
export class OAuthClientService {
  private readonly googleClient: any;

  constructor() {
    const clientParams = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_ClIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URIS?.split(',')[0],
    );
    this.googleClient = google.options({ auth: clientParams });
  }

  public async setGoogleClient() {
    await this.loadGoogleDriveCredentials();
    return this.googleClient;
  }

  get authorizedGoogleClient(): boolean {
    return !!this.googleClient.credentials;
  }

  public async generateAuthCredentials(token: string) {
    try {
      const googleDriveCredentials = await this.googleClient.getToken(token);

      await writeToFile(
        process.env.GOOGLE_DRIVE_CREDENTIALS_PATH,
        googleDriveCredentials.tokens,
      );
      this.googleClient.setCredentials(googleDriveCredentials);

      return this.googleClient;
    } catch (error) {
      return {
        status: error.response.status,
        error: error.response.data.error,
        error_description: error.response.data.error_description,
      };
    }
  }

  public getUrlForNewToken() {
    return this.googleClient.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
    });
  }

  private async loadGoogleDriveCredentials() {
    try {
      const googleDriveCredentials = await fs.readFileSync(
        process.env.GOOGLE_DRIVE_CREDENTIALS_PATH,
        'utf8',
      );

      return this.googleClient.setCredentials(
        JSON.parse(googleDriveCredentials),
      );
    } catch (e) {
      console.log('Client is not authorized');
      // throw new HttpException(
      //   'Google Drive client is not authenticated',
      //   HttpStatus.UNAUTHORIZED,
      // );
    }
  }
}
