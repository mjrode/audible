import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
const fs = require('fs');

interface GoogleConfig {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
}

@Injectable()
export class GdriveauthService {
  SCOPES = ['https://www.googleapis.com/auth/drive'];
  TOKEN_PATH = './token.json';

  googleConfig: GoogleConfig = {
    client_id: process.env.GOOGLE_DRIVE_ClIENT_ID,
    client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_DRIVE_REDIRECT_URIS.split(','),
  };

  async isClientIsAuthorized() {
    console.log('Auth service check');
    const auth = await this.isAuthTokenSet();
    console.log('Aauth back', auth);
    return auth;
  }

  async ensureAuthTokensAreSet() {
    await this.setAuthTokens();
  }

  async isAuthTokenSet() {
    if (fs.existsSync(this.TOKEN_PATH)) {
      console.log('File exists');
      return true;
    } else {
      console.log('File does not exist');
      return false;
    }
  }

  createOAuthGoogleClient() {
    console.log('Google Config', this.googleConfig.redirect_uris[0]);
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
      this.TOKEN_PATH,
      JSON.stringify(response.tokens),
    );
    console.log('File Response', fileResponse);
    return response.tokens;
  }

  async fetchAuthTokens() {
    const token = await fs.readFileSync(this.TOKEN_PATH, 'utf8');
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
