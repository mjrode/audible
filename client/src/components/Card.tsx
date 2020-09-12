import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { downloadBook, backendRequest } from '../api/ApiRequests';
import InfoAlert from './InfoAlert';

export interface IDownloadResponse {
  status: boolean;
  body: IDownloadResponseBody | string;
}

export interface IDownloadResponseBody {
  hashString: string;
  id: number;
  name: string;
}

const DisplayCard: React.FC<any> = ({ title, url, image, details }) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const handleDownloadClick = async () => {
    const { data } = await backendRequest({
      url: `/api/audiobay/details`,
      method: 'post',
      data: { url },
    });

    const response: IDownloadResponse | any = await downloadBook(data.infoHash);

    setOpenAlert(true);
    if (response.status) {
      setAlertText(`Successfully processed download for ${title}.`);
    } else {
      setAlertText(`Failed to process download for ${title}.`);
    }
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      maxWidth: 500,
    },
    media: {
      height: 0,
      paddingTop: '90%', // 16:9
    },
  }));
  const classes = useStyles();

  return (
    <Card
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        padding: '2em',
      }}
      className={classes.root}
    >
      <InfoAlert
        open={openAlert}
        setOpen={setOpenAlert}
        alertText={alertText}
      ></InfoAlert>
      <CardMedia className={classes.media} image={image} title="Book" />
      <Typography variant="h3" style={{ color: 'black' }}>
        <CardHeader title={title} />
      </Typography>

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {details}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Grid container justify="center">
          <Button
            color="primary"
            onClick={handleDownloadClick}
            startIcon={<CloudDownloadOutlinedIcon />}
          >
            Download Book
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default DisplayCard;
