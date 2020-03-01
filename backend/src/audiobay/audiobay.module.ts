import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {  AudioBayController } from './audiobay.controller';
import { AudioBayService } from './audiobay.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { AudioBaySchema } from './schemas/audiobay.schema';
import { AuthenticationMiddleware } from '../common/authentication.middleware';

@Module({
  controllers: [AudioBayController],
  providers: [AudioBayService]
})
export class AudioBayModule {}
