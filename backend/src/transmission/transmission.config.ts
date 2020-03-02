import { Injectable, Logger } from '@nestjs/common';

import {
  ITransmissionOptions,
  ITransmissionConfig,
  IOptions,
} from './interfaces/transmission.interface';

@Injectable()
export class TransmissionConfig implements ITransmissionConfig {
  localClientOptions = {
    port: process.env.TRANSMISSION_USERNAME,
    host: process.env.TRANSMISSION_USERNAME,
    ssl: process.env.TRANSMISSION_USERNAME === 'true',
    username: process.env.TRANSMISSION_USERNAME,
    password: process.env.TRANSMISSION_PASSWORD,
  };

  clientOptions = {};

  options() {
    return Object.assign(this.localClientOptions, this.clientOptions);
  }
}
