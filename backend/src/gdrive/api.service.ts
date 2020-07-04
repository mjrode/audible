import { Injectable } from '@nestjs/common';
const fs = require('fs');
const shell = require('shelljs');

const readline = require('readline');
import { google } from 'googleapis';
import { GdriveAuthService } from './auth.service';

@Injectable()
export class GdriveService {
  public googleDriveClient;
  constructor(private gdriveAuthService: GdriveAuthService) {
    this.googleDriveClient = this.gdriveAuthService.authorizedGoogleDriveClient();
  }
  directory = `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/complete`;
  // Called by the transmission poller
  // Checks if transmission
  // Uploads completed downloads to google drive
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

  async getFiles(folderId = null, file = true) {
    const files = await this.listFilesOrFolders(file, folderId);
    console.log(`GdriveService -> getFiles -> files`, files.length);
    return files;
  }

  async findFolder(name = null) {
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

  async uploadFile(fileName, folderId = '') {
    try {
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
