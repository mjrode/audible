import { Injectable } from '@nestjs/common';
import transmissionConfig from './transmission.config';
import * as Transmission from 'transmission';
import { EventEmitter } from 'events';
import { InjectEventEmitter } from '../utils/event-emitter.decorator';
import { TransmissionPoller } from './transmission.poller';
@Injectable()
export class TransmissionService {
  constructor(@InjectEventEmitter() private readonly emitter: EventEmitter) {}

  async processTorrents() {
    const torrents = await this.getTorrentDetails();
    if (torrents.length > 1) console.log('torrents', torrents);
    const audiobooks = await this.filterByDirectory(
      torrents,
      process.env.TRANSMISSION_DOWNLOAD_DIRECTORY,
    );
    if (audiobooks.length < 1) return [];
    console.log('audiobooks', audiobooks);
    const movedTorrents = await this.moveTorrent(audiobooks);
    console.log('Successfully moved torrents', movedTorrents);

    const removedTorrents = await this.removeTorrent(audiobooks);
    console.log('Removed torrent files', removedTorrents);
  }

  async filterByDirectory(torrents, directory) {
    return torrents.filter(
      torrent =>
        torrent.directory.includes(directory) && torrent.status === 'COMPLETED',
    );
  }

  async findCompletedTorrents(torrents) {
    return torrents.filter(torrent => torrent.precentComplete === 100);
  }
  async stats(): Promise<any> {
    const stats = await this.sessionStatsPromise();
    return stats;
  }

  async addTorrent(hash): Promise<any> {
    const urlFromHash = `magnet:?xt=urn:btih:${hash}`;
    const newTorrent: any = await this.addTorrentPromise(urlFromHash, {
      'download-dir': `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/incomplete`,
    });
    console.log('newTorrent', newTorrent);
    return newTorrent;
  }

  async getTorrentDetails(): Promise<any> {
    const details: any = await this.getTorrentDetailsPromise();

    if (details.torrents.length > 0) {
      return details.torrents.map(torrent => {
        const percentComplete = torrent.percentDone * 100;
        return {
          id: torrent.id,
          name: torrent.name,
          directory: torrent.downloadDir,
          precentComplete: percentComplete,
          status: this.getStatusType(torrent.status, percentComplete),
        };
      });
    }

    return [];
  }

  async getTorrentDetail(id): Promise<any> {
    const details: any = await this.getTorrentDetailsPromise(id);
    return details;
  }

  async moveTorrent(
    audiobooks,
    location = `${process.env.TRANSMISSION_DOWNLOAD_DIRECTORY}/complete`,
  ): Promise<any> {
    const ids = audiobooks.map(book => book.id);
    try {
      const response = await this.moveTorrentPromise(ids, location);
      return response;
    } catch (error) {
      console.log('error moving torrent', error);
    }
  }

  async removeTorrent(audiobooks): Promise<any> {
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
    return new Promise((resolve, reject) => {
      const client = this.transmissionClient();
      client.move(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
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
    const transmission = new Transmission(config);
    return transmission;
  }
}
