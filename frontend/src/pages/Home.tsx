import React, { useState, useEffect } from 'react';
import { withRouter, Redirect, useHistory, Route } from 'react-router-dom';
import SearchBox from 'src/components/SearchBox';
import { IResults } from './PageInterfaces';
import InfoAlert from '../components/InfoAlert';
import { CardGrid } from 'src/components/CardGrid';
import GoogleAuth from './GoogleAuth';
import {
  checkIfClientIsAuthorized,
  setBackendGoogleAuthToken,
} from '../api/ApiRequests';
import { Grid } from '@material-ui/core';
import queryString from 'query-string';

const initialResultsState = () => {
  return JSON.parse(window.localStorage.getItem('results')) || [];
};

const initialSearchTermState = () => {
  return window.localStorage.getItem('searchTerm') || '';
};

const resetInvalidCache = (results) => {
  try {
    results.map((result) => result);
  } catch (error) {
    console.log('Cache is invalid', error);
    window.localStorage.setItem('results', JSON.stringify([]));
  }
};

const resultsPresent = (results) => {
  return results.length > 1;
};

const Home: React.FC<any> = () => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTermState);
  const [results, setResults] = useState<Array<IResults>>(
    initialResultsState(),
  );
  const [open, setOpen] = useState(false);
  console.log('Results', results.length);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkIfClientIsAuthorized().then((authorized) => {
      console.log('Home client auth HOME', authorized);
      setAuthorized(authorized);
    });
  }, []);

  resetInvalidCache(results);

  useEffect(() => {
    let query = queryString.parse(location.search);
    console.log(`location.pathname`, location.pathname);

    const googleCallback = location.pathname.includes('/auth/google/callback');
    if (googleCallback) {
      const token = encodeURIComponent(query.code as any);
      console.log(`token`, token);
      setBackendGoogleAuthToken(token).then((response) => {
        console.log(`response =======`, response);
        setAuthorized(response);
      });
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    window.localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  const homePage = (
    <>
      <InfoAlert
        open={open}
        setOpen={setOpen}
        alertText="No results were found for your search"
      />
      <SearchBox
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setResults={setResults}
        setOpen={setOpen}
      />
      {resultsPresent(results) && <CardGrid results={results} />}
    </>
  );
  if (!authorized) {
    return <GoogleAuth></GoogleAuth>;
  } else {
    return homePage;
  }
};

export default withRouter(Home);
