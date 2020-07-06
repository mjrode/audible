import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { writeToFile } from '../utils/common';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

@Injectable()
export class OAuthClientService {
  private readonly oAuthClient: any;

  constructor() {
    this.oAuthClient = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_ClIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URIS?.split(',')[0],
    );
    google.options({ auth: this.oAuthClient });
  }

  public async googleClient() {
    await this.loadGoogleDriveCredentials();
    return this.oAuthClient;
  }

  get authorizedGoogleClient(): boolean {
    return !!this.oAuthClient.credentials;
  }

  public async generateAuthCredentials(token: string) {
    try {
      const googleDriveCredentials = await this.oAuthClient.getToken(token);

      await writeToFile(
        process.env.GOOGLE_DRIVE_CREDENTIALS_PATH,
        googleDriveCredentials.tokens,
      );
      this.oAuthClient.setCredentials(googleDriveCredentials);

      return this.oAuthClient;
    } catch (error) {
      return {
        status: error.response.status,
        error: error.response.data.error,
        error_description: error.response.data.error_description,
      };
    }
  }

  public getUrlForNewToken() {
    return this.oAuthClient.generateAuthUrl({
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

      return this.oAuthClient.setCredentials(
        JSON.parse(googleDriveCredentials),
      );
    } catch (e) {
      throw Error('Google Drive client is not authenticated');
    }
  }
}
