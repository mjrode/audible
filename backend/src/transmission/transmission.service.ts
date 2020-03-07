import { Injectable } from '@nestjs/common';
import transmissionConfig from './transmission.config';
import * as Transmission from 'transmission';

@Injectable()
export class TransmissionService {
  async stats(): Promise<any> {
    const stats = await this.sessionStatsPromise();
    return stats;
  }

  async addTorrent(hash): Promise<any> {
    const urlFromHash = `magnet:?xt=urn:btih:${hash}`;
    const newTorrent: any = await this.addTorrentPromise(urlFromHash, {
      'download-dir': '/books/incomplete',
    });
    console.log('newTorrent', newTorrent);
    return newTorrent;
  }

  async getTorrentDetails(): Promise<any> {
    const details: any = await this.getTorrentDetailsPromise();

    if (details.torrents.length > 0) {
      details.torrents.forEach(torrent => {
        console.log('Id =', torrent.id);
        console.log('Name = ' + torrent.name);
        console.log('Completed = ' + torrent.percentDone * 100);
        console.log('Status = ' + this.getStatusType(torrent.status));
      });
    }

    return details;
  }

  async getTorrentDetail(id): Promise<any> {
    const details: any = await this.getTorrentDetailsPromise(id);
    return details;
  }

  async moveTorrent(id, location = '/books/complete'): Promise<any> {
    const torrent = await this.moveTorrentPromise(id, location);
    return torrent;
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
      this.transmissionClient().move(args.id, args.location, (err, data) => {
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

  getStatusType(type) {
    return this.transmissionClient().statusArray[type];
  }

  public transmissionClient() {
    const config = transmissionConfig();
    const transmission = new Transmission(config);
    return transmission;
  }
}
