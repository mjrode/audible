import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Button, Grid, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import audiobook from '../assets/audiobook.png';
import Avatar from '@material-ui/core/Avatar';
import { useEffect, useState } from 'react';
import { getGoogleAuthUrl } from '../api/ApiRequests';

const NavBar: React.FC<any> = () => {
  const history = useHistory();

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Grid justify="space-between" container>
            <Grid item>
              <Link href="/">
                <Button>
                  <Avatar alt="Logo" src={audiobook} />
                  <Typography variant="h4" color="inherit">
                    AudioBook
                  </Typography>
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default withRouter(NavBar);
