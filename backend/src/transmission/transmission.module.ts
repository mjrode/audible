import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { TransmissionController } from './transmission.controller';
import { AuthenticationMiddleware } from '../auth/authentication.middleware';
import { TransmissionService } from './transmission.service';
import { TransmissionPoller } from './transmission.poller';
import { GdriveService } from '../gdrive/gdrive.service';

@Module({
  controllers: [TransmissionController],
  providers: [TransmissionService, TransmissionPoller, GdriveService],
})
export class TransmissionModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        { method: RequestMethod.POST, path: '/transmission/post' },
        { method: RequestMethod.PUT, path: '/transmission/edit' },
        { method: RequestMethod.DELETE, path: '/transmission/delete' },
      );
  }
}
