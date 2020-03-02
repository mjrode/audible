import { Injectable } from '@nestjs/common';
import axios from 'axios';
const cheerio = require('cheerio');

@Injectable()
export class AudioBayService {
  async query(term, page = null): Promise<any> {
    const url = this.buildUrl(term, page);
    const response = await this.fetchBooks(url);
    const res = response.results.toArray().filter(book => book.title);
    console.log('res', res);
    return res;
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

  buildUrl(term, page) {
    if (page) {
      return `http://audiobookbay.nl/${page}?s=${term}`;
    } else {
      return `http://audiobookbay.nl/?s=${term}`;
    }
  }
  async fetchBooks(url) {
    const httpClient = axios;
    const response = await httpClient.get(url);
    const $ = cheerio.load(response.data);

    let results = $('#content .post ').map((i, post) => {
      const title = $('.postTitle h2', post).text();
      const url = $('.postMeta .postLink a', post).attr('href');
      const details = $('.postInfo', post).text();
      const image = $('.postContent .center a img', post).attr('src');

      return { title, url, image, details };
    });

    const pages =
      results.toArray().length > 1
        ? $('.wp-pagenavi a')
            .last()
            .attr('href')
        : 0;

    const pageCount = pages.match(/\d+/)[0];
    return { results, pageCount };
  }
}
