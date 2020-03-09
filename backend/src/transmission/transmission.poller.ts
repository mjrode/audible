import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectEventEmitter } from 'src/utils/event-emitter.decorator';
import { EventEmitter } from 'events';
import { TransmissionService } from './transmission.service';
@Injectable()
export class TransmissionPoller {
  constructor(
    @InjectEventEmitter()
    private readonly emitter: EventEmitter,
    private readonly transmissionService: TransmissionService,
  ) {}

  public async onModuleInit() {
    this.emitter.on(
      'check-torrents',
      async () => await this.handleCheckTorrentsEvent(),
    );
  }

  async pollTorrents(): Promise<any> {
    setTimeout(() => this.emitter.emit('check-torrents'), 10000);
  }

  async handleCheckTorrentsEvent() {
    await this.transmissionService.processTorrents();
    this.pollTorrents();
  }
}
