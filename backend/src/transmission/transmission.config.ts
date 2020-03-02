import {
  ITransmissionOptions,
  ITransmissionConfig,
  IOptions,
} from './interfaces/transmission.interface';

const localClientOptions = {
  port: process.env.TRANSMISSION_PORT,
  host: process.env.TRANSMISSION_HOST,
  ssl: process.env.TRANSMISSION_SSL === 'true',
  username: process.env.TRANSMISSION_USERNAME,
  password: process.env.TRANSMISSION_PASSWORD,
};

const clientOptions = {};

const transmissionConfig = () => {
  return Object.assign(localClientOptions, clientOptions);
};

export default transmissionConfig;
