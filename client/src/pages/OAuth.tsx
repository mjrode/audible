import React, { useState, useEffect } from 'react';

import { setBackendGoogleAuthToken } from '../api/ApiRequests';
import Home from './Home';
import { Redirect } from 'react-router-dom';
import GoogleAuth from './GoogleAuth';
const queryString = require('querystring');

export default function OAuth() {
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    let query = queryString.parse(location.search);
    console.log(`OAuth -> query`, query);

    //TODO: Why is the question mark not being parsed
    const token = encodeURIComponent(query['?code'] as any);
    setBackendGoogleAuthToken(token).then((response) => {
      console.log(`OAuth -> token`, token);
      console.log(`response =======`, response);
      setAuthorized(true);
    });
  }, []);
  if (authorized) {
    return <Redirect to="/" />;
  }
  return <GoogleAuth></GoogleAuth>;
}
