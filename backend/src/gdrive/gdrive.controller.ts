import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { google } from 'googleapis';
import * as url from 'url';
import { pathToFileURL } from 'url';

import { GoogleDriveService } from './google-drive.service';
import { OAuthClientService } from './oauth-client.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('gdrive')
export class GdriveController {
  constructor(
    private googleDriveService: GoogleDriveService,
    private oAuthClientService: OAuthClientService,
  ) {}

  @Get('files')
  async getFiles(@Res() res) {
    const response = await this.googleDriveService.getFiles();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('authorize_credentials')
  async getAuthUrl(@Res() res) {
    const response = await this.oAuthClientService.getUrlForNewToken();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('authenticate/:token')
  async setAuthToken(@Res() res, @Param('token') token: string) {
    const response = await this.oAuthClientService.generateAuthCredentials(
      token,
    );
    console.log(`GdriveController -> setAuthToken -> response`, response);
    if (response.status === HttpStatus.OK) {
      return res.status(HttpStatus.OK).json(true);
    }
    return res.status(HttpStatus.OK).json(false);
  }

  @Get('folder/:name')
  async findFolder(@Res() res, @Param('name') name) {
    const response = await this.googleDriveService.findFolder(name);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('auth/google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.oAuthClientService.generateAuthCredentials(
      req.query.code,
    );
    if (response.status === HttpStatus.OK) {
      return res.status(HttpStatus.OK).json(true);
    }
    return res.status(HttpStatus.OK).json(false);
  }

  @Get('login')
  async authorized(@Res() res) {
    console.log('Calling Authorized--------------');
    const authenticated = await this.oAuthClientService.authenticated();
    if (authenticated) {
      return res.status(HttpStatus.OK).json(true);
    } else {
      return res.status(HttpStatus.OK).json(false);
    }
  }

  @Get('upload')
  async uploadFile(@Res() res, @Param('file') file) {
    const folderId = '1a7y0zs7BwiHXtqhQgaAMXWCZ0FnPs3bK';
    const filePath = '/Users/michaelrode/Downloads/IMG_1793.MOV';
    const response = await this.googleDriveService.uploadFile(
      filePath,
      folderId,
    );
    return res.status(HttpStatus.OK).json(response);
  }
}
