import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectEventEmitter } from 'src/utils/event-emitter.decorator';
import { EventEmitter } from 'events';
import { TransmissionService } from './transmission.service';
import { GdriveService } from '../gdrive/api.service';
@Injectable()
export class TransmissionPoller {
  constructor(
    @InjectEventEmitter()
    private readonly emitter: EventEmitter,
    private readonly transmissionService: TransmissionService,
    private readonly gdriveService: GdriveService,
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
    await this.transmissionService.moveCompletedTorrents();
    await this.gdriveService.processDownloads();
    this.pollTorrents();
  }
}
