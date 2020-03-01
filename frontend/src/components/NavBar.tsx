import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Button, Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import auth0Client from "../utils/auth";
import { useHistory } from "react-router-dom";

const NavBar: React.FC<any> = () => {
  const history = useHistory();

  const logout = (): void => {
    auth0Client.logout();
    history.replace("/");
  };

  return (
    <header>
      <AppBar position="static">
        <Toolbar>
          <Grid
            justify="space-between" // Add it here :)
            container
          >
            <Grid item>
              <Button component={Link} to={"/"}>
                <Typography variant="h4" color="inherit">
                  Audible
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
