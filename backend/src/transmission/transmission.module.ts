import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { TransmissionController } from './transmisson.controller';
import { AuthenticationMiddleware } from '../common/authentication.middleware';
import { TransmissionService } from './transmission.service';

@Module({
  controllers: [TransmissionController],
  providers: [TransmissionService],
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
