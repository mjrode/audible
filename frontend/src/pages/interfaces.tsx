export interface IResults {
  title?: string;
  link?: string;
  image?: string;
  details?: string;
}

export interface IAudioBayResponse {
  status: boolean;
  body: IAudioBayResponseBody[];
}

export interface IAudioBayResponseBody {
  title?: string;
  url?: string;
  image?: string;
  details?: string;
}
