import { Injectable, Param } from '@nestjs/common';
import * as EventEmitter from 'events';

@Injectable()
export class EventEmitterService {
  async init(): Promise<any> {
    const eventEmitter = new EventEmitter();
    return eventEmitter;
  }

  async eventEmitter(): Promise<any> {
    return this.eventEmitter;
  }

  async emitEvent(eventName: string): Promise<any> {
    const emitter = await this.eventEmitter();
    emitter().
    console.log('emitter', emitter);
  }

  async onEvent(eventName: string): Promise<any> {
    const emitter = await this.eventEmitter();
    console.log('emitter', emitter);
  }
}
