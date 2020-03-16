import { Module } from '@nestjs/common';

import { TransmissionController } from './transmission.controller';
import { TransmissionService } from './transmission.service';
import { TransmissionPoller } from './transmission.poller';
import { GdriveService } from '../gdrive/api.service';
import { GdriveauthService } from '../gdrive/auth.service';

@Module({
  controllers: [TransmissionController],
  providers: [
    TransmissionService,
    TransmissionPoller,
    GdriveService,
    GdriveauthService,
  ],
})
export class TransmissionModule {}
