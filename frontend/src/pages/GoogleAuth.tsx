import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { getGoogleAuthUrl, setGoogleAuthToken } from '../api/ApiRequests';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
const queryString = require('querystring');
export default function GoogleAuth() {
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');
  const [tokenValue, setTokenValue] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    getGoogleAuthUrl().then(url => {
      setGoogleAuthUrl(url);
    });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const encodedValue = encodeURIComponent(tokenValue);
    console.log(encodedValue);
    const response = await setGoogleAuthToken(encodedValue);
    console.log('Res', response);
    setAuthenticated(true);
  };
  if (googleAuthUrl) {
    return (
      <Container>
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
                onChange={e => setTokenValue(e.target.value)}
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
