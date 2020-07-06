import { Module } from '@nestjs/common';
import { GdriveService } from './google-drive.service';
import { GdriveController } from './gdrive.controller';
import { GdriveAuthService } from './auth.service';

@Module({
  providers: [GdriveService],
  controllers: [GdriveController],
  exports: [GdriveService],
})
export class GdriveModule {}
