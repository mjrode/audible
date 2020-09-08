export interface ITransmissionOptions {
  port?: string | number;
  host?: string;
  ssl?: boolean;
  username?: string;
  password?: string;
}

export interface ITransmissionConfig {
  options(): ITransmissionOptions;
}

export interface IOptions {
  (): ITransmissionOptions;
}
