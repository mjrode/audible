import { Module } from '@nestjs/common';
import { GdriveService } from './api.service';
import { GdriveController } from './gdrive.controller';
import { GdriveauthService } from './auth.service';

@Module({
  providers: [GdriveService, GdriveauthService],
  controllers: [GdriveController],
  exports: [GdriveService, GdriveauthService],
})
export class GdriveModule {}
