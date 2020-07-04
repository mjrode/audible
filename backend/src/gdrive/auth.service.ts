import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
const fs = require('fs');
// This service is responsible for:
// 1. Authenticate a client which can make requests to Google Drive
// 2. Generate a url which will allow the user to authorize this app to access their gDrive account
// 3. Provide a helper function to determine if the application has access to the current users drive account
// TODO: Store the Auth Tokens at the database level instead of creating a file to hold them.

interface GoogleConfig {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
}

@Injectable()
export class GdriveAuthService {
  SCOPES = ['https://www.googleapis.com/auth/drive'];

  googleConfig: GoogleConfig = {
    client_id: process.env.GOOGLE_DRIVE_ClIENT_ID,
    client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_DRIVE_REDIRECT_URIS?.split(','),
  };

  public async isClientAuthorized() {
    const res = await fs.existsSync(process.env.GOOGLE_DRIVE_CREDENTIALS_PATH);
    console.log(`GdriveAuthService -> isClientAuthorized -> auth`, res);
    return res;
  }

  public urlForValidationCode(): string {
    const oAuthClient = this.createOAuthGoogleClient();
    const auth = oAuthClient;
    return this.setScopedAuthUrl(auth);
  }

  public async authorizedGoogleDriveClient(): Promise<any> {
    if (this.isClientAuthorized) {
      const client = this.createOAuthGoogleClient();
      const authTokens = await this.googleDriveCredentials();
      await client.setCredentials(authTokens);
      return client;
    } else {
      new Error(
        `Google Drive authorization tokens are not set in ${process.env.GOOGLE_DRIVE_CREDENTIALS_PATH}`,
      );
    }
  }

  private createOAuthGoogleClient(): Partial<any> {
    const client = new google.auth.OAuth2(
      this.googleConfig.client_id,
      this.googleConfig.client_secret,
      this.googleConfig.redirect_uris[0],
    );
    google.options({ auth: client });
    return client;
  }

  private setScopedAuthUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: this.SCOPES,
    });
  }

  public async generateTokensAndWriteToFile(token: string) {
    try {
      const client = this.createOAuthGoogleClient();

      const googleDriveCredentials = await client.getToken(token);
      console.log(
        `GdriveAuthService -> generateTokensAndWriteToFile -> googleDriveCredentials`,
        googleDriveCredentials,
      );

      await fs.writeFileSync(
        process.env.GOOGLE_DRIVE_CREDENTIALS_PATH,
        JSON.stringify(googleDriveCredentials.tokens),
      );
      return { status: googleDriveCredentials.res.status };
    } catch (error) {
      return {
        status: error.response.status,
        error: error.response.data.error,
        error_description: error.response.data.error_description,
      };
    }
  }

  private async googleDriveCredentials() {
    const tokens = await fs.readFileSync(
      process.env.GOOGLE_DRIVE_CREDENTIALS_PATH,
      'utf8',
    );
    return JSON.parse(tokens);
  }
}
