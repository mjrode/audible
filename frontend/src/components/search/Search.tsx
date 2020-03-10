import React from 'react';
import { Grid } from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
import SearchIcon from '@material-ui/icons/Search';
const SearchBox: React.FC<any> = ({
  searchTerm,
  setSearchTerm,
  handleSearchSubmission,
}) => {
  console.log('term', searchTerm);
  console.log('setSearch', setSearchTerm);
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
