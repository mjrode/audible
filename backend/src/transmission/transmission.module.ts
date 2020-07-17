import { Module } from '@nestjs/common';

import { TransmissionController } from './transmission.controller';
import { TransmissionService } from './transmission.service';
import { TransmissionPoller } from './transmission.poller';
import { GoogleDriveService } from '../gdrive/google-drive.service';
import { GdriveAuthService } from '../gdrive/auth.service';
import { OAuthClientService } from '../gdrive/oauth-client.service';

@Module({
  controllers: [TransmissionController],
  providers: [
    TransmissionService,
    TransmissionPoller,
    GoogleDriveService,
    OAuthClientService,
    GdriveAuthService,
  ],
})
export class TransmissionModule {}
