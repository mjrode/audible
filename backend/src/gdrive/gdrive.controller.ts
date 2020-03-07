import { Controller, Get, Res } from '@nestjs/common';
import { GdriveService } from './gdrive.service';

@Controller('gdrive')
export class GdriveController {
  constructor(private gdriveService: GdriveService) {}

  @Get('files')
  async getFiles(@Res() res) {
    const response = await this.gdriveService.getFiles();
  }
}
