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
}
