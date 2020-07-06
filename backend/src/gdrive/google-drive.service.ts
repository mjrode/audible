// Tons of room to refactor this class.
// I need to find a better way of setting the google drive client

import { Injectable, Scope } from '@nestjs/common';
const fs = require('fs');
const shell = require('shelljs');

const readline = require('readline');
import { google } from 'googleapis';
import { OAuthClientService } from './oauth-client.service';

@Injectable()
export class GdriveService {
  directory: string;
  oAuthClient;
  googleClient;

  constructor(private readonly oAuthClientService: OAuthClientService) {
    this.directory = `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/complete`;
    this.googleDriveClient = this.setGoogleDriveClient();
  }

  private setGoogleDriveClient() {
    google.drive({ version: 'v3' });
    if (!this.oAuthClientService.isGoogleClientAuthorized()) {

    }
  }

  public async getFiles(folderId = null, file = true) {
    return this.listFilesOrFolders(file, folderId);
  }

  public async findFolder(name = null) {
    const folderName = name || process.env.GOOGLE_DRIVE_AUDIO_BOOK_FOLDER_NAME;
    const files = await this.listFilesOrFolders(false);
    const folder = files.filter(
      file => file.name.toLowerCase() === folderName.toLowerCase(),
    );
    console.log(
      `Google Drive Folder ${process.env.GOOGLE_DRIVE_AUDIO_BOOK_FOLDER_NAME}:`,
      folder,
    );
    return folder[0];
  }

  public async uploadFile(fileName, folderId = '') {
    try {
      console.log(`GdriveService -> uploadFile -> fileName`, fileName);
      const fileSize = fs.statSync(fileName).size;

      console.log(`GdriveService -> uploadFile -> drive`, drive);
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
      return res.data;
    } catch (error) {
      console.log('error uploading file', error);
      return [];
    }
  }

  public async processDownloads() {
    const completedTransmissionDownloads = await this.getCompletedTransmissionDownloads();
    const googleDriveBookFolder = await this.findFolder();

    googleDriveBookFolder &&
      completedTransmissionDownloads.forEach(async file => {
        await this.uploadToGoogleDriveAndRemoveLocal(
          file,
          googleDriveBookFolder,
        );
      });
  }

  private async getCompletedTransmissionDownloads() {
    console.log(
      `GdriveService -> processDownloads -> directory`,
      this.directory,
    );
    if (!fs.existsSync(this.directory)) {
      console.log('Directory does not exist');
      await shell.mkdir('-p', this.directory);
    }
    const completedTransmissionDownloads = await fs.readdirSync(
      this.directory,
      'utf8',
    );
    console.log('Completed transmission', completedTransmissionDownloads);
    return completedTransmissionDownloads;
  }

  private async uploadToGoogleDriveAndRemoveLocal(file, googleDriveBookFolder) {
    const upload = await this.uploadFile(
      `${this.directory}/${file}`,
      googleDriveBookFolder.id,
    );
    console.log('UploadedFile', upload);

    const removeFile = await fs.unlinkSync(`${this.directory}/${file}`);
    console.log('Deleted file', removeFile);
  }

  private async listFilesOrFolders(file = true, folderId = null) {
    try {
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
