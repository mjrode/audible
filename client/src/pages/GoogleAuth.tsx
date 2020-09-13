import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {
  getGoogleAuthUrl,
  setBackendGoogleAuthToken,
  checkIfClientIsAuthorized,
} from '../api/ApiRequests';
import Link from '@material-ui/core/Link';
import InfoAlert from '../components/InfoAlert';
import { Box } from '@material-ui/core';
const queryString = require('querystring');
export default function GoogleAuth() {
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');
  const [tokenValue, setTokenValue] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [open, setOpen] = useState(false);
  const [googleDriveError, setGoogleDriveError] = useState('');

  useEffect(() => {
    checkIfClientIsAuthorized().then((authorized) => {
      console.log('Authorized effect', authorized);
      setAuthorized(authorized);
    });
  }, []);

  useEffect(() => {
    getGoogleAuthUrl().then((url) => {
      setGoogleAuthUrl(url);
    });
  }, []);

  if (googleAuthUrl) {
    return (
      <Box mx="auto" pt="5rem" width="25%">
        <InfoAlert open={open} setOpen={setOpen} alertText={googleDriveError} />

        <Link href={googleAuthUrl} target="_blank">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ minHeight: '5rem' }}
          >
            Sign in with Google Drive!
          </Button>
        </Link>
      </Box>
    );
  } else {
    return <p>Loading...</p>;
  }
}
