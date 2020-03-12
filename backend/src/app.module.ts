import { Module } from '@nestjs/common';
import { AudioBayModule } from './audiobay/audiobay.module';
import { TransmissionModule } from './transmission/transmission.module';
import { GdriveModule } from './gdrive/gdrive.module';
import { EventEmitterModule } from './utils/event-emitter.module';
import { EventEmitter } from 'events';
import { InjectEventEmitter } from './utils/event-emitter.decorator';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { typeOrmConfig } from './config/typeorm.config';
// import { UserModule } from './users/user.module';
@Module({
  imports: [
    // TypeOrmModule.forRoot(typeOrmConfig),
    // UserModule,
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
