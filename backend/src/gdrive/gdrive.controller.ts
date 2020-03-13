import { Controller, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { GdriveService } from './gdrive.service';
import * as url from 'url';
import { pathToFileURL } from 'url';

@Controller('gdrive')
export class GdriveController {
  constructor(private gdriveService: GdriveService) {}

  @Get('files')
  async getFiles(@Res() res) {
    const response = await this.gdriveService.getFiles();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('auth')
  async getAuthUrl(@Res() res) {
    const response = await this.gdriveService.urlForRequestToken();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get(':token')
  async setAuthToken(@Res() res, @Param('token') token: string) {
    console.log('Token', token);
    process.env['GOOGLE_AUTH_ACCESS_TOKEN'] = token;
    return res.status(HttpStatus.OK).json({ token_set: true });
  }

  @Get('folder/:name')
  async findFolder(@Res() res, @Param('name') name) {
    const response = await this.gdriveService.findFolder(name);
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
