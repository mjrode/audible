import React, { useState, useEffect } from "react";
import SearchBar from "material-ui-search-bar";
import DisplayCard from "./Card";
import { Grid, Snackbar, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { RouteComponentProps, withRouter, useHistory } from "react-router-dom";
import auth0Client from "../utils/auth";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    "& > * + *": {
      marginTop: theme.spacing(2)
    },
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
  const classes = useStyles();
  const [title, setTitle] = useState<string>("");
  const [results, setResults] = useState<Array<IResults>>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [submitSuccess, setSubmitSuccess] = useState(null);

  const handleSearchSubmission = async (): Promise<void> => {
    setLoading(true);

    const response: any = await submitForm();

    setLoading(false);
    setResults(response.body);
    if (response.body.length < 1) {
      setOpen(true);
    } else {
      setSubmitSuccess(response.status);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="info">
          No results were found for your search
        </Alert>
      </Snackbar>
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
        <Grid container spacing={3}>
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
