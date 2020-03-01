import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel, getModelToken } from '@nestjs/mongoose';
import axios from 'axios';
const cheerio = require('cheerio');
import { Client, ClientOptions, Torrent } from 'transmission-api';
import { promisify } from 'util';
const Transmission = require('transmission');

@Injectable()
export class AudioBayService {
  async query(term): Promise<any> {
    const httpClient = axios;
    const url = `http://audiobookbay.nl/?s=${term}`;
    const response = await httpClient.get(url);
    const $ = cheerio.load(response.data);
    const results = $('#content .post ').map((i, post) => {
      const title = $('.postTitle h2', post).text();
      const url = $('.postMeta .postLink a', post).attr('href');
      const details = $('.postInfo', post).text();
      const image = $('.postContent .center a img', post).attr('src');
      return { title, url, image, details };
    });

    return results.toArray();
  }

  async bookDetails(url): Promise<any> {
    const httpClient = axios;
    const response = await httpClient.get(url);
    const $ = cheerio.load(response.data);

    const results = $('#content .post ').map((i, post) => {
      const author = $('.postContent .desc .author a', post).text();
      const description = $('.postContent .desc p', post).text();
      const title = $('.postTitle h1', post).text();
      const details = $('.postInfo', post).text();
      const infoHash = $('td:contains(Info Hash)', post)
        .next()
        .text();
      const image = $('.postContent .center a img', post).attr('src');
      return { title, url, image, details, author, description, infoHash };
    });

    return results.toArray();
  }

  async torrent(): Promise<any> {
    try {
      const transmission = new Transmission({
        port: 443,
        host: 'torrent.mjrflix.com',
        ssl: true,
        username: process.env.TRANSMISSION_USERNAME,
        password: process.env.TRANSMISSION_PASSWORD,
      });

      const sessionStatsPromise = (...args) => {
        return new Promise((resolve, reject) => {
          transmission.sessionStats(...args, (err, data) => {
            if (err) return reject(err);
            resolve(data);
          });
        });
      };
      const stats = sessionStatsPromise().then(data =>
        console.log('data', data),
      );
    } catch (error) {
      console.log('Error', error);
    }
  }

  async addTorrent(hash): Promise<any> {
    try {
      const urlFromHash = `magnet:?xt=urn:btih:${hash}`;
      const transmission = new Transmission({
        port: 443,
        host: 'torrent.mjrflix.com',
        ssl: true,
        username: process.env.TRANSMISSION_USERNAME,
        password: process.env.TRANSMISSION_PASSWORD,
      });

      // Get torrent state
      function getStatusType(type) {
        return transmission.statusArray[type];
        if (type === 0) {
          return 'STOPPED';
        } else if (type === 1) {
          return 'CHECK_WAIT';
        } else if (type === 2) {
          return 'CHECK';
        } else if (type === 3) {
          return 'DOWNLOAD_WAIT';
        } else if (type === 4) {
          return 'DOWNLOAD';
        } else if (type === 5) {
          return 'SEED_WAIT';
        } else if (type === 6) {
          return 'SEED';
        } else if (type === 7) {
          return 'ISOLATED';
        }
      }

      function getTorrentDetails() {
        transmission.get(function(err, result) {
          if (err) {
            throw err;
          }
          if (result.torrents.length > 0) {
            result.torrents.forEach(torrent => {
              console.log('Name = ' + torrent.name);
              console.log('Completed = ' + torrent.percentDone * 100);
              console.log('Status = ' + getStatusType(torrent.status));
            });
          }
        });
      }
      getTorrentDetails();
      const addTorrentPromise = (...args) => {
        return new Promise((resolve, reject) => {
          transmission.addUrl(...args, (err, data) => {
            if (err) return reject(err);
            resolve(data);
          });
        });
      };

      console.log('Moving Torrent');
      const newTorrent: any = await addTorrentPromise(urlFromHash, {
        'download-dir': '/books/incomplete',
      });
      console.log('newTorrent', newTorrent);

      transmission.move(newTorrent.id, '/books/complete', function(
        err,
        result,
      ) {
        if (err) {
          return console.log(err);
        }

        console.log('Moved torrent', result);
        console.log('Torrent ID: ' + newTorrent.id);
      });

      console.log('newTorrent', newTorrent);
    } catch (error) {
      console.log('Error', error);
    }
  }
}
