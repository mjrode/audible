import * as React from 'react';
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import GoogleAuth from './pages/GoogleAuth';
import { Redirect } from 'react-router-dom';
import OAuth from './pages/OAuth';
import {
  Toolbar,
  Button,
  Grid,
  CssBaseline,
  Container,
} from '@material-ui/core';

export interface ISessionState {
  validateSession: boolean;
}

class App extends React.Component<
  {} & RouteComponentProps<any>,
  ISessionState
> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="App">
        <CssBaseline />
        <NavBar />
        <Container>
          <Switch>
            <Route path={'/login'} exact={true} component={GoogleAuth} />
            <Route
              path={'/auth/google/callback'}
              exact={true}
              component={OAuth}
            />
            <Route path={'/'} exact={false} component={Home} />
          </Switch>
        </Container>
      </div>
    );
  }
}

export default withRouter(App);
