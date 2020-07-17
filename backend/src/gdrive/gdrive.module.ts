import { Module } from '@nestjs/common';
import { GdriveController } from './gdrive.controller';
import { OAuthClientService } from './oauth-client.service';
import { GoogleDriveService } from './google-drive.service';
import { GdriveAuthService } from './auth.service';

@Module({
  providers: [GoogleDriveService, OAuthClientService, GdriveAuthService],
  controllers: [GdriveController],
  exports: [GoogleDriveService, OAuthClientService, GdriveAuthService],
})
export class GdriveModule {}
