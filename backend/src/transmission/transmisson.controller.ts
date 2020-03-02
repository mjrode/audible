import { Controller, Get, Res, HttpStatus } from '@nestjs/common';

@Controller('transmission')
export class TransmissionController {
  @Get('status')
  async getStatus(@Res() res) {
    const status = { status: 'ok' };
    return res.status(HttpStatus.OK).json(status);
  }
}
