import auth0Client from 'src/utils/Auth';

export const downloadBook = async infoHash => {
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

export const getDetails = async url => {
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
    const response = await fetch(`/gdrive/auth`, {
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

export const setGoogleAuthToken = async token => {
  console.log('Token', token);
  try {
    const response = await fetch(`/gdrive/${token}`, {
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
