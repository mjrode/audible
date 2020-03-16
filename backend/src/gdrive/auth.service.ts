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
export class GdriveauthService {
  SCOPES = ['https://www.googleapis.com/auth/drive'];

  googleConfig: GoogleConfig = {
    client_id: process.env.GOOGLE_DRIVE_ClIENT_ID,
    client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_DRIVE_REDIRECT_URIS.split(','),
  };

  async isClientAuthorized() {
    const auth = await this.isAuthTokenSet();
    return auth;
  }

  async ensureAuthTokensAreSet() {
    await this.setAuthTokens();
  }

  async isAuthTokenSet() {
    if (fs.existsSync(process.env.TOKEN_PATH)) {
      return true;
    } else {
      return false;
    }
  }

  createOAuthGoogleClient() {
    const client = new google.auth.OAuth2(
      this.googleConfig.client_id,
      this.googleConfig.client_secret,
      this.googleConfig.redirect_uris[0],
    );
    google.options({ auth: client });
    return client;
  }

  setScopedAuthUrl(auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: this.SCOPES,
    });
  }

  urlForValidationCode() {
    const oAuthClient = this.createOAuthGoogleClient();
    const auth = oAuthClient;
    const url = this.setScopedAuthUrl(auth);
    return url;
  }

  async setAuthTokens() {
    if (!process.env.GOOGLE_AUTH_VALIDATION_CODE) return [];
    const client = this.createOAuthGoogleClient();
    const response = await client.getToken(
      process.env.GOOGLE_AUTH_VALIDATION_CODE,
    );
    const fileResponse = await fs.writeFileSync(
      process.env.TOKEN_PATH,
      JSON.stringify(response.tokens),
    );
    return response.tokens;
  }

  async fetchAuthTokens() {
    const token = await fs.readFileSync(process.env.TOKEN_PATH, 'utf8');
    return JSON.parse(token);
  }

  async authorizedClient() {
    const client = this.createOAuthGoogleClient();
    const authTokens = await this.fetchAuthTokens();
    await client.setCredentials(authTokens);
    return client;
  }
}

// Token {
//   access_token: 'ya29.a0Adw1xeVWpHlUJn12E7lCGLX0UHclKLkEdsI1NsTah507GWdogkMkhleVnyWXMx66wbl9nCUApdL5cnRfkEvneZUKuBIn4oTGdkOJDVlQhRnwe1_PeVTwmf6tzAmTaaygomi63oghsPpuykQJahrXXMWrIRitsRFtVW4',
//   refresh_token: '1//0fDRkWUR5stz0CgYIARAAGA8SNwF-L9IrDi5pWnil6WDmSfxE3PvXPtuDWSUNukU4oKXJrag6fwFSL-XNyi8YuSx41YRUIt-9cY0',
//   scope: 'https://www.googleapis.com/auth/drive',
//   token_type: 'Bearer',
//   expiry_date: 1584087578020
// }
