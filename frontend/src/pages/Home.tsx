import React, { useState, useEffect } from 'react';
import SearchBar from 'material-ui-search-bar';
import DisplayCard from '../components/Card';
import { Grid, Snackbar, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { RouteComponentProps, withRouter, useHistory } from 'react-router-dom';
import auth0Client from '../utils/auth';
import Alert from '@material-ui/lab/Alert';
import SearchBox from 'src/components/search/Search';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
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
const initalResultsState = () => {
  return JSON.parse(window.localStorage.getItem('results')) || [];
};

const initalSearchTermState = () => {
  return window.localStorage.getItem('searchTerm') || '';
};

const Home: React.FC<any> = () => {
  const [searchTerm, setSearchTerm] = useState<string>(initalSearchTermState);
  const [results, setResults] = useState<Array<IResults>>(initalResultsState());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    window.localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  const [submitSuccess, setSubmitSuccess] = useState(results.length > 1);

  const handleSearchSubmission = async (): Promise<void> => {
    setLoading(true);

    const response: any = await submitForm();

    setLoading(false);
    setResults(response.body);
    if (response.body.length < 1) {
      setOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const submitForm = async () => {
    try {
      const response = await fetch(`/audiobay/${searchTerm}`, {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authorization: `Bearer ${auth0Client.getIdToken()}`,
        }),
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
    details: result.details,
  });

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="info">
          No results were found for your search
        </Alert>
      </Snackbar>
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchSubmission={handleSearchSubmission}
      />
      {submitSuccess && !loading && (
        <Grid container spacing={3}>
          {results.map(result => (
            <Grid item style={{ display: 'flex' }} key={result.title}>
              <DisplayCard {...setProps(result)}></DisplayCard>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default withRouter(Home);
