import { Injectable } from '@nestjs/common';

const Transmission = require('transmission');

@Injectable()
export class TransmissionService {
  constructor(private readonly transmissionConfig) {}

  async stats(): Promise<any> {
    const stats = await this.sessionStatsPromise(
      this.transmissionConfig.options,
    );
    console.log('Stats', stats);
    return stats;
  }

  sessionStatsPromise = (...args) => {
    return new Promise((resolve, reject) => {
      this.transmissionClient().sessionStats(...args, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  };

  public transmissionClient() {
    const transmission = new Transmission(this.transmissionConfig.options);
    return transmission;
  }
}
