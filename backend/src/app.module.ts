// testing hook
import { Module, HttpModule, HttpService } from '@nestjs/common';
import { AudioBayModule } from './audiobay/audiobay.module';
import { TransmissionModule } from './transmission/transmission.module';
import { GdriveModule } from './gdrive/gdrive.module';
import { EventEmitterModule } from './utils/event-emitter.module';
import { EventEmitter } from 'events';
import { InjectEventEmitter } from './utils/event-emitter.decorator';
import { requestResponseLogger } from './utils/request-response-logger';
@Module({
  imports: [
    HttpModule,
    AudioBayModule,
    TransmissionModule,
    GdriveModule,
    EventEmitterModule.forRoot(new EventEmitter()),
  ],
})
export class AppModule {
  constructor(@InjectEventEmitter() private readonly emitter: EventEmitter) {}
  public async onModuleInit() {
    requestResponseLogger();
    this.emitter.emit('check-torrents');
  }
}
