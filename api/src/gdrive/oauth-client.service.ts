import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';
import { writeToFile } from '../utils/common';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

@Injectable()
export class OAuthClientService {
  private oAuthClient: any;

  constructor() {
    this.oAuthClient = new google.auth.OAuth2(
      process.env.GOOGLE_DRIVE_ClIENT_ID,
      process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      process.env.GOOGLE_DRIVE_REDIRECT_URIS,
    );
  }
  public async getAuthenticatedClient() {
    console.log('Calling authenticate');
    try {
      await this.loadGoogleDriveCredentials();

      return google.drive({ version: 'v3', auth: this.oAuthClient });
    } catch (error) {
      throw new HttpException(
        'Google Drive client is not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  public async authenticated() {
    console.log('Calling authenticated');
    try {
      await this.loadGoogleDriveCredentials();

      const tokenInfo = await this.oAuthClient.getTokenInfo(
        this.oAuthClient.credentials.access_token,
      );

      return true;
    } catch (error) {
      console.log(
        `OAuthClientService -> authenticated -> error`,
        error.message,
      );
      return false;
    }
  }

  public async generateAuthCredentials(token = null) {
    console.log(
      `OAuthClientService -> generateAuthCredentials -> token`,
      this.oAuthClient.credentials,
    );
    try {
      await this.loadGoogleDriveCredentials();
      const refreshToken =
        decodeURIComponent(token) || this.oAuthClient.credentials.access_token;

      const googleDriveCredentials = await this.oAuthClient.getToken(
        refreshToken,
      );

      await writeToFile(
        process.env.GOOGLE_DRIVE_CREDENTIALS_PATH,
        googleDriveCredentials.tokens,
      );
      this.oAuthClient.setCredentials(googleDriveCredentials);
      console.log(
        `OAuthClientService -> generateAuthCredentials -> googleDriveCredentials`,
        googleDriveCredentials,
      );

      return { status: 200 };
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
      console.log(e.message);
    }
  }
}
