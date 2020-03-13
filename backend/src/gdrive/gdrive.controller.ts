import { Controller, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { GdriveService } from './gdrive.service';
import * as url from 'url';
import { pathToFileURL } from 'url';
import { GdriveauthService } from './gdriveauth.service';

@Controller('gdrive')
export class GdriveController {
  constructor(
    private gdriveService: GdriveService,
    private gdriveauthService: GdriveauthService,
  ) {}

  @Get('files')
  async getFiles(@Res() res) {
    const response = await this.gdriveService.getFiles();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('auth')
  async getAuthUrl(@Res() res) {
    const response = await this.gdriveauthService.urlForValidationCode();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('validation/:token')
  async setAuthToken(@Res() res, @Param('token') token: string) {
    console.log('Token', token);
    process.env['GOOGLE_AUTH_VALIDATION_CODE'] = token;
    return res.status(HttpStatus.OK).json({ token_set: true });
  }

  @Get('folder/:name')
  async findFolder(@Res() res, @Param('name') name) {
    const response = await this.gdriveService.findFolder(name);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('authorized')
  async authorized(@Res() res) {
    console.log('Was I aclled');
    const response = await this.gdriveauthService.isClientIsAuthorized();
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
