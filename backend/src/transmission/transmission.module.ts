import { Module } from '@nestjs/common';

import { TransmissionController } from './transmission.controller';
import { TransmissionService } from './transmission.service';
import { TransmissionPoller } from './transmission.poller';
import { GdriveService } from '../gdrive/google-drive.service';
import { GdriveAuthService } from '../gdrive/auth.service';

@Module({
  controllers: [TransmissionController],
  providers: [
    TransmissionService,
    TransmissionPoller,
    GdriveService,
    GdriveAuthService,
  ],
})
export class TransmissionModule {}
