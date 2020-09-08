import { HttpService } from '@nestjs/common';
export const requestResponseLogger = () => {
  const httpService = new HttpService();
  console.log('Request logger');
  if (process.env.ENABLE_ENV_LOGGING) {
    console.log(process.env);
  }

  httpService.axiosRef.interceptors.request.use(function(config) {
    if (process.env.ENABLE_REQUEST_LOGGING) {
      console.log('Config', [config.url, config.method]);
    }

    return config;
  });

  httpService.axiosRef.interceptors.response.use(function(response) {
    if (process.env.ENABLE_RESPONSE_HEADER_LOGGING) {
      console.log('Response', [response.status, response.headers]);
    }
    if (process.env.ENABLE_RESPONSE_DATA_LOGGING) {
      console.log('Response', [response.data, response.headers]);
    }
    return response;
  });
};
