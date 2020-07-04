import axios from 'axios';

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
    const response = await fetch(`/transmission/add/${infoHash}`, {
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
      `/audiobay/details/${encodeURIComponent(url)}`,
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
    const response = await fetch(`/gdrive/authorize_credentials`, {
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
    const response = await fetch(`/gdrive/validation/${token}`, {
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
    const response = await fetch(`/gdrive/authorized`, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    });
    console.log('Check if clien auth api frontend');
    const json = await response.json();
    console.log('client is authorized', json);
    return json;
  } catch (ex) {
    console.log('Error', ex);
    return false;
  }
};
