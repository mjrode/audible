import { Injectable } from '@nestjs/common';
const fs = require('fs');

const readline = require('readline');
import { google } from 'googleapis';
import { GdriveauthService } from './auth.service';

@Injectable()
export class GdriveService {
  constructor(private gdriveauthService: GdriveauthService) {}

  async authorizeGoogleClient() {
    await this.gdriveauthService.ensureAuthTokensAreSet();
    await this.gdriveauthService.authorizedClient();
  }

  // Called by the transmission poller
  // Checks if transmission
  async processDownloads() {
    const directory = `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/complete`;
    const completedTransmissionDownloads = await fs.readdirSync(
      directory,
      'utf8',
    );
    console.log('Completed', completedTransmissionDownloads);
    const driveBookFolder = await this.findFolder('AudioBooks');
    console.log('Book Folder', driveBookFolder);
    const driveBooks = await this.getFiles(driveBookFolder.id, false);
    // console.log('Drive Books', driveBooks);
    if (completedTransmissionDownloads < 1) return;
    completedTransmissionDownloads.forEach(async file => {
      const upload = await this.uploadFile(
        `${directory}/${file}`,
        driveBookFolder.id,
      );
      console.log('UploadedFile', upload);

      const removeFile = await fs.unlinkSync(`${directory}/${file}`);
      console.log('Deleted file', removeFile);
    });
    console.log(
      'completedTransmissionDownloads',
      completedTransmissionDownloads,
    );
  }

  async getFiles(folderId = null, file = true) {
    const files = await this.listFilesOrFolders(file, folderId);
    return files;
  }

  async findFolder(name: string) {
    // console.log('Trying to find Drive Folder', name);
    // console.log('Auth', auth);
    const files = await this.listFilesOrFolders(false);
    // console.log('Files', files);
    const folder = files.filter(file => file.name === name);
    // console.log('findFolder', folder);
    return folder[0];
  }

  async uploadFile(fileName, folderId = '') {
    try {
      await this.authorizeGoogleClient();

      const fileSize = fs.statSync(fileName).size;
      const drive = google.drive({ version: 'v3' });
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
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.log('error uploading file', error);
      return [];
    }
  }

  async listFilesOrFolders(file = true, folderId = null) {
    try {
      await this.authorizeGoogleClient();
      const drive = google.drive({ version: 'v3' });
      const fileParams = {
        pageSize: 100,
        spaces: 'drive',
        fields: 'files(id,name),nextPageToken',
      };
      const query = folderId
        ? `mimeType="application/vnd.google-apps.folder" and "${folderId}" in parents and trashed=false`
        : 'mimeType="application/vnd.google-apps.folder"';
      const folderParams = {
        q: query,
        pageSize: 100,
        spaces: 'drive',
        fields: 'files(id,name),nextPageToken',
      };
      // console.log('fileParams', fileParams);
      const driveParams = file ? fileParams : folderParams;
      const res = await drive.files.list(driveParams);
      const files = res.data.files;
      return files;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  }
}
