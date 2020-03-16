import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SearchBox from 'src/components/SearchBox';
import { IResults } from './PageInterfaces';
import InfoAlert from '../components/InfoAlert';
import { CardGrid } from 'src/components/CardGrid';
import GoogleAuth from './GoogleAuth';
import { checkIfClientIsAuthorized } from '../api/ApiRequests';
import { Grid } from '@material-ui/core';

const initalResultsState = () => {
  return JSON.parse(window.localStorage.getItem('results')) || [];
};

const initalSearchTermState = () => {
  return window.localStorage.getItem('searchTerm') || '';
};

const resetInvalidCache = results => {
  try {
    results.map(result => result);
  } catch (error) {
    console.log('Cache is invalid', error);
    window.localStorage.setItem('results', JSON.stringify([]));
  }
};

const resultsPresent = results => {
  return results.length > 1;
};

const Home: React.FC<any> = () => {
  const [searchTerm, setSearchTerm] = useState<string>(initalSearchTermState);
  const [results, setResults] = useState<Array<IResults>>(initalResultsState());
  const [open, setOpen] = useState(false);
  const [googleAuthToken, setGoogleAuthToken] = useState(false);
  console.log('Results', results.length);
  // const [authorized, setAuthorized] = useState(false);

  // useEffect(() => {
  //   checkIfClientIsAuthorized().then(authorized => {
  //     console.log('Home client auth HOME', authorized);
  //     setAuthorized(authorized);
  //   });
  // }, []);

  resetInvalidCache(results);

  useEffect(() => {
    window.localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    window.localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  return (
    <Grid container>
      <Grid item>
        <InfoAlert
          open={open}
          setOpen={setOpen}
          alertText="No results were found for your search"
        />
      </Grid>
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setResults={setResults}
        setOpen={setOpen}
      />
      {resultsPresent(results) && <CardGrid results={results} />}
    </Grid>
  );
};

export default withRouter(Home);
