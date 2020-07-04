import axios from 'axios';
console.log('processssss-', process.env);
const apiUrl = process.env.REACT_APP_PROXY_SERVER;

export const backendRequest: any = async (options) => {
  const res = encodeURI(options.url);

  const axiosOptions = {
    url: options.url,
    method: options.method || 'get',
    ...(options.data && { data: options.data }),
  };
  console.log('Axios Options', axiosOptions);
  const response = await axios.request(axiosOptions);
  return response;
};

export const downloadBook = async (infoHash) => {
  try {
    console.log(`apiUrl`, apiUrl);
    const response = await fetch(apiUrl + `/api/transmission/add/${infoHash}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    });
    const json = await response.json();
    console.log('Added Book', json);
    return { status: true, body: json };
  } catch (error) {
    console.log('Error', error);
    return { status: false, body: 'Unable to process download' };
  }
};

export const getDetails = async (url) => {
  try {
    const response = await fetch(
      apiUrl + `/audiobay/details/${encodeURIComponent(url)}`,
      {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      },
    );
    const json = await response.json();
    return json[0];
  } catch (ex) {
    return false;
  }
};

export const getGoogleAuthUrl = async () => {
  try {
    const response = await fetch(apiUrl + `/api/gdrive/authorize_credentials`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    });
    const json = await response.json();
    return json;
  } catch (ex) {
    return false;
  }
};

export const setBackendGoogleAuthToken = async (token) => {
  console.log('Token', token);
  try {
    const response = await fetch(apiUrl + `/api/gdrive/validation/${token}`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    });
    const json = await response.json();
    console.log('authResponse', json);
    return json;
  } catch (ex) {
    return false;
  }
};

export const checkIfClientIsAuthorized = async () => {
  try {
    console.log('PROCESS ----', process.env.NODE_ENV);
    const response = await fetch(apiUrl + '/api/gdrive/authorized', {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    });
    console.log('Check if client auth api frontend', response);
    const json = await response.json();
    console.log('client is authorized', json);
    return json;
  } catch (ex) {
    console.log('Error', ex);
    return false;
  }
};
