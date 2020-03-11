import * as React from 'react';
import { Grid } from '@material-ui/core';
import DisplayCard from './Card';

type Props = { results };

export function CardGrid(props: Props) {
  const { results } = props;
  const setDisplayCardProps = result => ({
    title: result.title,
    url: result.url,
    image: result.image,
    details: result.details,
  });

  return (
    <Grid container spacing={3}>
      {results.map(result => (
        <Grid item style={{ display: 'flex' }} key={result.title} xs={6}>
          <DisplayCard {...setDisplayCardProps(result)}></DisplayCard>
        </Grid>
      ))}
    </Grid>
  );
}