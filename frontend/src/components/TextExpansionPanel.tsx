import * as React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Paper,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import stripHTML from 'string-strip-html';
type Props = {
  description: string;
};
export function TextExpansionPanel(props: Props) {
  const { description } = props;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Grid item>
          <Typography paragraph display="block">
            Book Details
          </Typography>
        </Grid>
      </ExpansionPanelSummary>
      <Grid item>
        <Typography paragraph display="block">
          <ExpansionPanelDetails>
            {stripHTML(description)}
          </ExpansionPanelDetails>
        </Typography>
      </Grid>
    </ExpansionPanel>
  );
}
