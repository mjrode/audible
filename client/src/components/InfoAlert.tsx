import React from 'react';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const InfoAlert: React.FC<any> = ({ open, setOpen, alertText }) => {
  console.log('Open', open);
  if (open) {
    console.log('Info alert triggered:', alertText);
  }
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      // autoHideDuration={6000}
      style={{ paddingTop: '15em' }}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="info">
        {alertText}
      </Alert>
    </Snackbar>
  );
};

export default InfoAlert;
