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
import Grid from '@material-ui/core/Grid';
import { Redirect } from 'react-router-dom';
import InfoAlert from '../components/InfoAlert';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const encodedValue = encodeURIComponent(tokenValue);
    console.log(encodedValue);
    const response = await setBackendGoogleAuthToken(encodedValue);
    console.log(`handleSubmit -> response`, response);

    if (!response.token_set) {
      setOpen(true);
      setGoogleDriveError(`Error fetching google drive credentials:
      ${response.error} ${response.error_description}`);
    } else {
      window.location.reload(true);
    }
  };

  if (googleAuthUrl) {
    return (
      <Container>
        <InfoAlert open={open} setOpen={setOpen} alertText={googleDriveError} />
        <Container>
          <Grid item>
            <Typography component="h1" variant="h4">
              Click{' '}
              <Link target="_blank" href={googleAuthUrl}>
                here
              </Link>{' '}
              to generate an auth token. Then enter it in the form below.
            </Typography>
          </Grid>
        </Container>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div>
            <Typography component="h1" variant="h5">
              Enter Auth Token
            </Typography>
            <form noValidate onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                value={tokenValue}
                onChange={(e) => setTokenValue(e.target.value)}
                fullWidth
                id="auth-token"
                label="Google Auth Token"
                name="auth-token"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Submit token
              </Button>
            </form>
          </div>
        </Container>
      </Container>
    );
  } else {
    return <p>Loading...</p>;
  }
}
