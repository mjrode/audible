import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { EventEmitter } from 'events';
import { TransmissionService } from './transmission.service';
import { GdriveService } from '../gdrive/api.service';
import { InjectEventEmitter } from '../utils/event-emitter.decorator';
import { GdriveAuthService } from '../gdrive/auth.service';
@Injectable()
export class TransmissionPoller {
  constructor(
    @InjectEventEmitter()
    private readonly emitter: EventEmitter,
    private readonly transmissionService: TransmissionService,
    private readonly gdriveService: GdriveService,
    private readonly gdriveAuthService: GdriveAuthService,
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
    try {
      console.log('Checking torrent events');
      await this.transmissionService.moveCompletedTorrents();
      await this.gdriveService.processDownloads();
      this.pollTorrents();
    } catch (error) {
      console.log('Error polling torrents', error);
    }
  }
}
