import { Injectable } from '@nestjs/common';
const fs = require('fs');

const readline = require('readline');
import { google } from 'googleapis';

@Injectable()
export class GdriveService {
  SCOPES = ['https://www.googleapis.com/auth/drive'];
  TOKEN_PATH = './token.json';

  async processDownloads() {
    const directory = `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/complete`;
    const completedDownloads = await fs.readdirSync(directory, 'utf8');
    console.log('Completed', completedDownloads);
    const driveBookFolder = await this.findFolder('AudioBooks');
    console.log('Book Folder', driveBookFolder);
    const driveBooks = await this.getFiles(driveBookFolder.id, false);
    console.log('Drive Books', driveBooks);
    if (completedDownloads < 1) return;
    completedDownloads.forEach(async file => {
      const upload = await this.uploadFile(
        `${directory}/${file}`,
        driveBookFolder.id,
      );
      console.log('UploadedFile', upload);

      const removeFile = await fs.unlinkSync(`${directory}/${file}`);
      console.log('Deleted file', removeFile);
    });
    console.log('completedDownloads', completedDownloads);
  }

  async getFiles(folderId = null, file = true) {
    const auth = await this.authenticateClient();
    const files = await this.listFilesOrFolders(auth, file, folderId);
    return files;
  }

  async findFolder(name: string) {
    console.log('Trying to find Drive Folder', name);
    const auth = await this.authenticateClient();
    console.log('Auth', auth);
    const files = await this.listFilesOrFolders(auth, false);
    console.log('Files', files);
    const folder = files.filter(file => file.name === name);
    console.log('findFolder', folder);
    return folder[0];
  }

  async uploadFile(fileName, folderId = '') {
    try {
      const auth = await this.authenticateClient();
      console.log('Filename', fileName);

      const fileSize = fs.statSync(fileName).size;
      const drive = google.drive({ version: 'v3', auth });
      const res = await drive.files.create(
        {
          requestBody: { name: fileName, parents: [folderId] },
          media: {
            body: fs.createReadStream(fileName),
          },
        },
        {
          onUploadProgress: evt => {
            const progress = (evt.bytesRead / fileSize) * 100;
            readline.clearLine();
            readline.cursorTo(0);
            process.stdout.write(`${Math.round(progress)}% complete`);
          },
        },
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log('error uploading file', error);
      return [];
    }
  }

  createConfig() {
    return {
      installed: {
        client_id: process.env.GOOGLE_DRIVE_ClIENT_ID,
        project_id: process.env.GOOGLE_DRIVE_PROJECT_ID,
        auth_uri: process.env.GOOGLE_DRIVE_AUTH_URI,
        token_uri: process.env.GOOGLE_DRIVE_TOKEN_URI,
        auth_provider_x509_cert_url:
          process.env.GOOGLE_DRIVE_AUTH_PROVIDER_X509_CERT_URL,
        client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
        redirect_uris: process.env.GOOGLE_DRIVE_REDIRECT_URIS.split(','),
      },
    };
  }

  async authenticateClient() {
    // Authorize a client with credentials, then call the Google Drive API.
    console.log('Config', this.createConfig());
    const authenticatedClient = await this.authorize(this.createConfig());
    return authenticatedClient;
  }

  async authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    );

    google.options({ auth: oAuth2Client });

    try {
      const token = await fs.readFileSync(this.TOKEN_PATH, 'utf8');
      oAuth2Client.setCredentials(JSON.parse(token));
      return Promise.resolve(oAuth2Client);
    } catch (error) {
      await this.getAccessToken(oAuth2Client);
      return Promise.resolve(oAuth2Client);
    }
  }

  async getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log('Token stored to', this.TOKEN_PATH);
        });
        return oAuth2Client;
      });
    });
  }

  async listFilesOrFolders(auth, file = true, folderId = null) {
    try {
      const drive = google.drive({ version: 'v3', auth });
      const fileParams = {
        pageSize: 100,
        spaces: 'drive',
        fields: 'files(id,name),nextPageToken',
      };
      const query = folderId
        ? `mimeType="application/vnd.google-apps.folder" and "${folderId}" in parents and trashed=false`
        : 'mimeType="application/vnd.google-apps.folder"';
      console.log('Query', query);
      const folderParams = {
        q: query,
        pageSize: 100,
        spaces: 'drive',
        fields: 'files(id,name),nextPageToken',
      };
      console.log('fileParams', fileParams);
      const driveParams = file ? fileParams : folderParams;
      const res = await drive.files.list(driveParams);
      const files = res.data.files;
      return files;
    } catch (error) {
      console.log('error', error);
      return [];
    }
    // const response = await drive.files.list(driveParams, (err, res) => {
    //   if (err) return console.log('The API returned an error: ' + err);
    //   const files = res.data.files;
    //   if (files.length > 1) {
    //     // console.log('files', files);
    //     return files;
    //   } else {
    //     console.log('No files found.');
    //   }
    // });
    // return response;
  }
}
