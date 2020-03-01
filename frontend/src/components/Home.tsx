import React, { useState, useEffect } from "react";
import SearchBar from "material-ui-search-bar";
import DisplayCard from "./Card";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Input,
  makeStyles
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { RouteComponentProps, withRouter } from "react-router-dom";
import auth0Client from "../utils/auth";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

export interface IValues {
  title: string;
  author: string;
}

export interface IResults {
  title: string;
  link: string;
  image: string;
  details: string;
}

export interface IFormState {
  [key: string]: any;
  values: IValues[];
  submitSuccess?: boolean;
  loading: boolean;
  results: IResults[];
}

const Home: React.FC<any> = () => {
  const [title, setTitle] = useState<string>("");
  const [results, setResults] = useState<Array<IResults>>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const handleSearchSubmission = async (): Promise<void> => {
    setLoading(true);

    const response: any = await submitForm();
    console.log(response);
    setSubmitSuccess(response.status);
    setLoading(false);
    setResults(response.body);
  };

  const submitForm = async () => {
    try {
      const response = await fetch(`/audiobay/${title}`, {
        method: "get",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: `Bearer ${auth0Client.getIdToken()}`
        })
      });
      const json = await response.json();
      return { status: response.ok, body: json };
    } catch (ex) {
      return false;
    }
  };
  const setProps = result => ({
    title: result.title,
    url: result.url,
    image: result.image,
    details: result.details
  });

  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h2>Search for Books</h2>
          <SearchBar
            searchIcon={<SearchIcon />}
            value={title}
            onChange={newValue => setTitle(newValue)}
            onRequestSearch={() => handleSearchSubmission()}
          />
        </Grid>
      </Grid>

      {submitSuccess && !loading && (
        <Grid container spacing={5}>
          {results.map(result => (
            <Grid item style={{ display: "flex" }} key={result.title}>
              <DisplayCard {...setProps(result)}></DisplayCard>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default withRouter(Home);
