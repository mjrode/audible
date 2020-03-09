import { Module } from '@nestjs/common';
import { AudioBayModule } from './audiobay/audiobay.module';
import { TransmissionModule } from './transmission/transmission.module';
import { GdriveModule } from './gdrive/gdrive.module';
import { EventEmitterModule } from './utils/event-emitter.module';
import { EventEmitterService } from './utils/event-emitter.service';
import { EventEmitter } from 'events';
import { InjectEventEmitter } from './utils/event-emitter.decorator';
@Module({
  imports: [
    AudioBayModule,
    TransmissionModule,
    GdriveModule,
    EventEmitterModule.forRoot(new EventEmitter()),
  ],
})
export class AppModule {
  constructor(@InjectEventEmitter() private readonly emitter: EventEmitter) {}
  public async onModuleInit() {
    this.emitter.emit('check-torrents');
  }
}
