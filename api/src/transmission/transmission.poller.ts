import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { EventEmitter } from 'events';
import { TransmissionService } from './transmission.service';
import { GoogleDriveService } from '../gdrive/google-drive.service';
import { InjectEventEmitter } from '../utils/event-emitter.decorator';
@Injectable()
export class TransmissionPoller {
  constructor(
    @InjectEventEmitter()
    private readonly emitter: EventEmitter,
    private readonly transmissionService: TransmissionService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  public async onModuleInit() {
    if (process.env.ENABLE_POLLING) {
      console.log('Polling module initiated');
      this.emitter.on(
        'check-torrents',
        async () => await this.handleCheckTorrentsEvent(),
      );
    }
  }

  async pollTorrents(): Promise<any> {
    setTimeout(() => this.emitter.emit('check-torrents'), 10000);
  }

  async handleCheckTorrentsEvent() {
    try {
      console.log('Checking torrent events');
      await this.transmissionService.moveCompletedTorrents();
      await this.googleDriveService.processDownloads();
      this.pollTorrents();
    } catch (error) {
      console.log('Error polling torrents', error);
    }
  }
}
