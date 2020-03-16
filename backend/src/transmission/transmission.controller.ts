import { Controller, Get, Res, HttpStatus, Param } from '@nestjs/common';
import { TransmissionService } from './transmission.service';
import { InjectEventEmitter } from '../utils/event-emitter.decorator';
import { EventEmitter } from 'events';

@Controller('transmission')
export class TransmissionController {
  constructor(
    private transmissionService: TransmissionService,
    @InjectEventEmitter() private readonly emitter: EventEmitter,
  ) {}

  @Get('status')
  async getStatus(@Res() res) {
    const stats = await this.transmissionService.stats();
    return res.status(HttpStatus.OK).json(stats);
  }

  @Get('details')
  async getAllDetails(@Res() res) {
    const response = await this.transmissionService.getTorrentDetails();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('details/:id')
  async getDetails(@Res() res, @Param('id') id) {
    const response = await this.transmissionService.getTorrentDetail(id);
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('move/:id')
  async move(@Res() res, @Param('id') id) {
    const response = await this.transmissionService.moveCompletedTorrents();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('add/:id')
  async add(@Res() res, @Param('id') id) {
    const response = await this.transmissionService.addTorrent(id);
    return res.status(HttpStatus.OK).json(response);
  }
}
