import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {  AudioBayController } from './audiobay.controller';
import { AudioBayService } from './audiobay.service';

@Module({
  controllers: [AudioBayController],
  providers: [AudioBayService]
})
export class AudioBayModule {}
