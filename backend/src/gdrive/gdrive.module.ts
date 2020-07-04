import { Module } from '@nestjs/common';
import { GdriveService } from './api.service';
import { GdriveController } from './gdrive.controller';
import { GdriveAuthService } from './auth.service';

@Module({
  providers: [GdriveService, GdriveAuthService],
  controllers: [GdriveController],
  exports: [GdriveService, GdriveAuthService],
})
export class GdriveModule {}
