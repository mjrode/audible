import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {  AudioBayController } from './audiobay.controller';
import { AudioBayService } from './audiobay.service';
import { AuthenticationMiddleware } from '../auth/authentication.middleware';

@Module({
  controllers: [AudioBayController],
  providers: [AudioBayService]
})
export class AudioBayModule {}
