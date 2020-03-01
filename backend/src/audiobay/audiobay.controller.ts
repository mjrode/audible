import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Param,
  Logger,
  NotFoundException,
  Post,
  Body,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { AudioBayService } from './audiobay.service';

@Controller('audiobay')
export class AudioBayController {
  private readonly logger = new Logger(AudioBayController.name);

  constructor(private audioBayService: AudioBayService) {}

  // Query
  @Get(':term')
  async queryBooks(@Res() res, @Param('term') term) {
    try {
      const transmission = await this.audioBayService.addTorrent(
        '1b53cd490302384dbf3f0166ff7848528241868e',
      );
      console.log('Trans', transmission);
    } catch (e) {
      console.log('Error', e);
    }

    const results = await this.audioBayService.query(term);
    return res.status(HttpStatus.OK).json(results);
  }

  @Get('details/:url')
  async bookDetails(@Res() res, @Param('url') url) {
    const results = await this.audioBayService.bookDetails(url);
    return res.status(HttpStatus.OK).json(results);
  }
}
