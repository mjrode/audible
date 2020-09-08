// test
import { Injectable } from '@nestjs/common';
import transmissionConfig from './transmission.config';
import * as Transmission from 'transmission';
import { EventEmitter } from 'events';
import { InjectEventEmitter } from '../utils/event-emitter.decorator';
import * as path from 'path';
import { TransmissionPoller } from './transmission.poller';
@Injectable()
export class TransmissionService {
  constructor(@InjectEventEmitter() private readonly emitter: EventEmitter) {}

  async moveCompletedTorrents() {
    const completedAudiobooks = await this.completedAudioBookTorrents();
    console.log(
      `TransmissionService -> moveCompletedTorrents -> completedAudiobooks`,
      completedAudiobooks,
    );
    if (completedAudiobooks) {
      await this.moveTorrentToCompletedDirectory(completedAudiobooks);

      await this.removeTorrent(completedAudiobooks);
      console.log('Removed torrent files', completedAudiobooks);
    }
  }

  async completedAudioBookTorrents() {
    const torrents = await this.getTorrentDetails();
    console.log(
      `TransmissionService -> completedAudioBookTorrents -> torrents`,
      torrents,
    );
    const completedDownloads = await this.filterByDirectory(
      torrents,
      this.transmissionDownloadDirectory() + '/incomplete',
    );
    console.log(
      `TransmissionService -> completedAudioBookTorrents -> completedDownloads`,
      completedDownloads,
    );

    return completedDownloads;
  }

  async filterByDirectory(torrents, directory) {
    return torrents.filter(torrent => {
      return (
        torrent.directory.includes(directory) && torrent.percentComplete === 100
      );
    });
  }

  async findCompletedTorrents(torrents) {
    return torrents.filter(torrent => torrent.percentComplete === 100);
  }
  async stats(): Promise<any> {
    const stats = await this.sessionStatsPromise();
    return stats;
  }

  async addTorrent(hash): Promise<any> {
    const urlFromHash = `magnet:?xt=urn:btih:${hash}`;
    console.log('Trying to add torrent', hash);
    const downloadDirectory =
      this.transmissionDownloadDirectory() + '/incomplete';
    console.log(
      `TransmissionService -> constructor -> downloadDirectory`,
      downloadDirectory,
    );
    const newTorrent: any = await this.addTorrentPromise(urlFromHash, {
      'download-dir': downloadDirectory,
    });
    console.log('newTorrent', newTorrent);
    return newTorrent;
  }

  transmissionDownloadDirectory() {
    return path.resolve(`${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}`);
  }

  async getTorrentDetails(): Promise<any> {
    try {
      const details: any = await this.getTorrentDetailsPromise();

      if (details.torrents.length > 0) {
        return details.torrents.map(torrent => {
          const percentComplete = torrent.percentDone * 100;
          return {
            id: torrent.id,
            name: torrent.name,
            directory: torrent.downloadDir,
            percentComplete: percentComplete,
            status: this.getStatusType(torrent.status, percentComplete),
          };
        });
      }
    } catch (error) {
      console.log('Error', error);
    }

    return [];
  }

  async getTorrentDetail(id): Promise<any> {
    const details: any = await this.getTorrentDetailsPromise(id);
    console.log(`TransmissionService -> constructor -> details`, details);
    return details;
  }

  async moveTorrentToCompletedDirectory(
    audiobooks,
    location = this.transmissionDownloadDirectory() + '/complete',
  ): Promise<any> {
    console.log('Audiobooks in move torrent', audiobooks);
    if (audiobooks.length < 1) {
      console.log('No completed downloads to move');
      return [];
    }
    console.log('Audio books updated', audiobooks);
    const ids = audiobooks.map(book => book.id);
    try {
      return this.moveTorrentPromise(ids, location);
    } catch (error) {
      console.log('error moving torrent', error);
    }
  }

  async removeTorrent(audiobooks): Promise<any> {
    console.log('Audibooks in remove torrent', audiobooks);
    const ids = audiobooks.map(book => book.id);
    try {
      console.log('Remove these ids', ids);
      const response = await this.removeTorrentPromise(ids);
      return response;
    } catch (error) {
      console.log('error moving torrent', error);
    }
  }

  sessionStatsPromise = (...args) => {
    return new Promise((resolve, reject) => {
      const trans = this.transmissionClient();
      trans.sessionStats(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };

  moveTorrentPromise = (...args: any) => {
    console.log('TransmissionService -> moveTorrentPromise -> args', args);
    return new Promise((resolve, reject) => {
      const client = this.transmissionClient();
      return client.move(...args, (err, data) => {
        if (err) return reject(err);
        console.log('Data', data);
        return resolve(data);
      });
    });
  };

  removeTorrentPromise = (...args: any) => {
    return new Promise((resolve, reject) => {
      const client = this.transmissionClient();
      client.remove(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };

  addTorrentPromise = (...args) => {
    return new Promise((resolve, reject) => {
      this.transmissionClient().addUrl(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };

  getTorrentDetailsPromise = (...args: any) => {
    const parsedArgs = args.map(num => parseInt(num));
    return new Promise((resolve, reject) => {
      this.transmissionClient().get(...parsedArgs, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };

  getStatusType(type, percentComplete) {
    const status = this.transmissionClient().statusArray[type];
    return percentComplete === 100 && status === 'STOPPED'
      ? 'COMPLETED'
      : status;
  }

  public transmissionClient() {
    const config = transmissionConfig();
    return new Transmission(config);
  }
}
