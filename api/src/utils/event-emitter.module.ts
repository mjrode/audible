import { Module, Global, Provider } from '@nestjs/common';
import { EventEmitter } from 'events';
import { EVENT_EMITTER_TOKEN } from './constants';
interface NestEmitter extends EventEmitter {}

@Global()
@Module({})
export class EventEmitterModule {
  public static forRoot(emitter: NestEmitter) {
    const providers: Provider[] = [
      { provide: EVENT_EMITTER_TOKEN, useValue: emitter },
    ];
    return {
      module: EventEmitterModule,
      providers,
      exports: providers,
    };
  }
}
