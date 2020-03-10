import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import SearchBox from 'src/components/search/SearchBox';
import { IResults } from './interfaces';
import InfoAlert from '../components/InfoAlert';
import { CardGrid } from 'src/components/CardGrid';

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
  const [submitSuccess, setSubmitSuccess] = useState(results.length > 1);

  resetInvalidCache(results);

  useEffect(() => {
    window.localStorage.setItem('results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    window.localStorage.setItem('searchTerm', searchTerm);
  }, [searchTerm]);

  return (
    <div>
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
      {submitSuccess && resultsPresent(results) && (
        <CardGrid results={results} />
      )}
    </div>
  );
};

export default withRouter(Home);
