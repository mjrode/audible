import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Button, Grid, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import auth0Client from '../utils/Auth';
import { useHistory } from 'react-router-dom';
import audiobook from '../assets/audiobook.png';
import Avatar from '@material-ui/core/Avatar';
import { useEffect, useState } from 'react';
import { getGoogleAuthUrl } from '../api/ApiRequests';

const NavBar: React.FC<any> = () => {
  const history = useHistory();

  const logout = (): void => {
    auth0Client.logout();
    history.replace('/');
  };

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Grid justify="space-between" container>
            <Grid item>
              <Button>
                <Avatar alt="Logo" src={audiobook} />
                <Typography variant="h4" color="inherit">
                  AudiBook
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default withRouter(NavBar);
