import { Module } from '@nestjs/common';
import { GdriveService } from './gdrive.service';
import { GdriveController } from './gdrive.controller';
import { GdriveauthService } from './gdriveauth.service';

@Module({
  providers: [GdriveService, GdriveauthService],
  controllers: [GdriveController],
  exports: [GdriveService, GdriveauthService],
})
export class GdriveModule {}
