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

  get googleClient(): any {
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
      return this.oAuthClient.setCredentials(googleDriveCredentials);
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
}
