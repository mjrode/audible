import { Module } from '@nestjs/common';
import { GdriveController } from './gdrive.controller';
import { OAuthClientService } from './oauth-client.service';
import { GoogleDriveService } from './google-drive.service';

@Module({
  providers: [GoogleDriveService, OAuthClientService],
  controllers: [GdriveController],
  exports: [GoogleDriveService, OAuthClientService],
})
export class GdriveModule {}
