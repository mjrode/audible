import * as React from "react";
import {
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import Home from "./pages/Home";
import Callback from "./components/Callback";
import auth0Client from "./utils/auth";
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import {
  Toolbar,
  Button,
  Grid,
  CssBaseline,
  Container
} from "@material-ui/core";

export interface ISessionState {
  validateSession: boolean;
}
class App extends React.Component<
  {} & RouteComponentProps<any>,
  ISessionState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      validateSession: true
    };
  }

  public async componentDidMount() {
    if (this.props.location.pathname === "/callback") {
      this.setState({ validateSession: false });
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error === "login_required") {
        return;
      }
      console.log(err);
    }
    this.setState({ validateSession: false });
  }

  public render() {
    return (
      <div className="App">
        <CssBaseline />
        <NavBar />
        <Container>
          <Switch>
            <Route path={"/"} exact={true} component={Home} />
            <Route path={"/callback"} exact={true} component={Callback} />
          </Switch>
        </Container>
      </div>
    );
  }
}

export default withRouter(App);
