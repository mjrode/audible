import { Injectable, Scope, HttpException, HttpStatus } from '@nestjs/common';
const fs = require('fs');
const shell = require('shelljs');
import * as os from 'os';

const readline = require('readline');
import { google } from 'googleapis';
import { OAuthClientService } from './oauth-client.service';
import * as path from 'path';
import { requestResponseLogger } from '../utils/request-response-logger';

@Injectable()
export class GoogleDriveService {
  directory: string;
  oAuthClient;
  googleClient;

  constructor(private readonly oAuthClientService: OAuthClientService) {
    const dir = path.join(
      os.homedir(),
      `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/complete`,
    );
    this.directory = dir;
  }

  public async onModuleInit() {
    google.drive({ version: 'v3' });
    this.googleClient = await this.oAuthClientService.setGoogleClient();
  }

  public async getFiles(folderId = null, file = true) {
    return this.listFilesOrFolders(file, folderId);
  }

  public async findFolder(name = null) {
    const folderName = name || process.env.GOOGLE_DRIVE_AUDIO_BOOK_FOLDER_NAME;
    try {
      const files = await this.listFilesOrFolders(false);
      const folder = files.filter(
        file => file.name.toLowerCase() === folderName.toLowerCase(),
      );
      return folder[0];
    } catch (error) {
      throw new HttpException(
        `Unable to find google drive folder ${folderName}`,
        HttpStatus.NO_CONTENT,
      );
    }
  }

  public async uploadFile(fileName, folderId = '') {
    try {
      const fileSize = await fs.statSync(fileName).size;

      const res = await this.googleClient.files.create({
        requestBody: { name: fileName, parents: [folderId] },
        media: {
          body: fs.createReadStream(fileName),
        },
        // },
        // {
        //   onUploadProgress: evt => {
        //     const progress = (evt.bytesRead / fileSize) * 100;
        //     readline.clearLine();
        //     readline.cursorTo(0);
        //     process.stdout.write(`${Math.round(progress)}% complete`);
        //   },
      });
      console.log(`GoogleDriveService -> uploadFile -> res`, res.data);
      return res.data;
    } catch (error) {
      console.log('error uploading file', error);
      return [];
    }
  }

  public async processDownloads() {
    const completedTransmissionDownloads = await this.getCompletedTransmissionDownloads();
    const googleDriveBookFolder = await this.findFolder();
    console.log(
      `GoogleDriveService -> processDownloads -> googleDriveBookFolder`,
      googleDriveBookFolder,
    );

    googleDriveBookFolder &&
      completedTransmissionDownloads.map(async file => {
        const response = await this.uploadToGoogleDriveAndRemoveLocal(
          file,
          googleDriveBookFolder,
        );
        console.log(
          `GoogleDriveService -> processDownloads -> response`,
          response,
        );
        return response;
      });
  }

  private async getCompletedTransmissionDownloads() {
    console.log(
      `googleDriveService -> processDownloads -> directory`,
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
      `${__dirname}/${file}`,
      googleDriveBookFolder.id,
    );

    const removedFile = await fs.unlinkSync(`${this.directory}/${file}`);
    console.log(
      `GoogleDriveService -> uploadToGoogleDriveAndRemoveLocal -> removedFile`,
      removedFile,
    );
    const response = { upload, removedFile };

    return response;
  }

  private async listFilesOrFolders(file = true, folderId = null) {
    try {
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
      console.log(
        `GoogleDriveService -> listFilesOrFolders -> this.googleClient`,
        this.googleClient,
      );
      const res = this.googleClient.files.list(driveParams);
      console.log(`GoogleDriveService -> listFilesOrFolders -> res`, res);
      const files = res.data.files;
      console.log(`GoogleDriveService -> listFilesOrFolders -> files`, files);
      return files;
    } catch (error) {
      console.log('error', error);
      return [];
    }
  }
}
