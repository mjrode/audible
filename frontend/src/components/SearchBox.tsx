import React from 'react';
import { Grid } from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
import SearchIcon from '@material-ui/icons/Search';
import auth0Client from 'src/utils/auth';
import { IAudioBayResponse } from '../pages/Interfaces';
const SearchBox: React.FC<any> = ({
  searchTerm,
  setSearchTerm,
  setOpen,
  setLoading,
  setResults,
}) => {
  const handleSearchSubmission = async (): Promise<void> => {


    const response: IAudioBayResponse | false = await submitForm();

    setResults(response.body);

    if (response.body.length < 1) {
      setOpen(true);
    }
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
    } catch (err) {
      return { status: false, body: JSON.stringify(err) };
    }
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
