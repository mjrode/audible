import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
import SearchIcon from '@material-ui/icons/Search';
import { IAudioBayResponse } from '../pages/PageInterfaces';
import { backendRequest } from '../api/ApiRequests';

const SearchBox: React.FC<any> = ({
  searchTerm,
  setSearchTerm,
  setOpen,
  setResults,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleSearchSubmission = async (): Promise<void> => {
    setLoading(true);
    const response = await submitForm();

    setResults(response.data);
    setLoading(false);

    if (response.data.length < 1) {
      setOpen(true);
    }
  };

  const submitForm = async () => {
    const url = `/audiobay/${searchTerm}`;
    const response = await backendRequest({ url });
    console.log('Search Response', response);
    return response;
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <h2>Search for Books</h2>
        <SearchBar
          searchIcon={<SearchIcon />}
          value={searchTerm}
          onChange={newValue => setSearchTerm(newValue)}
          onRequestSearch={() => handleSearchSubmission()}
        />
      </Grid>
    </Grid>
  );
};

export default SearchBox;
