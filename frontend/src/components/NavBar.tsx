import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Button, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Link, withRouter } from 'react-router-dom';
import auth0Client from '../utils/Auth';
import { useHistory } from 'react-router-dom';
import audiobook from '../assets/audiobook.png';
import Avatar from '@material-ui/core/Avatar';

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
              <Button component={Link} to={'/'}>
                <Avatar alt="Logo" src={audiobook} />
                <Typography variant="h4" color="inherit">
                  AudiBook
                </Typography>
              </Button>
            </Grid>

            <Grid item>
              {!auth0Client.isAuthenticated() && (
                <Button onClick={auth0Client.login}>Sign in</Button>
              )}
              {auth0Client.isAuthenticated() && (
                <Button onClick={() => logout()}>Sign Out</Button>
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default withRouter(NavBar);
