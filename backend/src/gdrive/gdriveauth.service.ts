import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

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

  // console.log('Auth Token', process.env.GOOGLE_AUTH_ACCESS_TOKEN);
  // const creds = await this.setCredentials();
  // console.log('Creds', JSON.stringify(creds));
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

  async setCredentials() {
    if (!process.env.GOOGLE_AUTH_ACCESS_TOKEN) return [];
    const client = this.createOAuthGoogleClient();
    const token = await client.getToken(process.env.GOOGLE_AUTH_ACCESS_TOKEN);
    console.log('Token', token.tokens);
    return token.tokens;
  }
}
