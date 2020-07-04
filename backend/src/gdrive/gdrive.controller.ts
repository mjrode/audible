import { Controller, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { GdriveService } from './api.service';
import * as url from 'url';
import { pathToFileURL } from 'url';
import { GdriveAuthService } from './auth.service';

@Controller('gdrive')
export class GdriveController {
  constructor(
    private gdriveService: GdriveService,
    private gdriveAuthService: GdriveAuthService,
  ) {}

  @Get('files')
  async getFiles(@Res() res) {
    const response = await this.gdriveService.getFiles();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('authorize_credentials')
  async getAuthUrl(@Res() res) {
    const response = await this.gdriveAuthService.urlForValidationCode();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('validation/:token')
  async setAuthToken(@Res() res, @Param('token') token: string) {
    const response = await this.gdriveAuthService.generateTokensAndWriteToFile(
      token,
    );
    console.log(`GdriveController -> setAuthToken -> response`, response);
    if (response.status === HttpStatus.OK) {
      return res.status(HttpStatus.OK).json({ token_set: true });
    } else {
      return res.status(response.status).json({
        token_set: false,
        error: response.error,
        error_description: response.error_description,
      });
    }
  }

  @Get('folder/:name')
  async findFolder(@Res() res, @Param('name') name) {
    const response = await this.gdriveService.findFolder(name);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('authorized')
  async authorized(@Res() res) {
    const response = await this.gdriveAuthService.isClientAuthorized();
    console.log('Response', response);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('upload')
  async uploadFile(@Res() res, @Param('file') file) {
    const folderId = '1a7y0zs7BwiHXtqhQgaAMXWCZ0FnPs3bK';
    const filePath = '/Users/michaelrode/Downloads/IMG_1793.MOV';
    const response = await this.gdriveService.uploadFile(filePath, folderId);
    return res.status(HttpStatus.OK).json(response);
  }
}
