import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import auth0Client from "../utils/auth";

const BookDetails: React.FC<any> = ({ url }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = async () => {
    console.log("Url", url);
    await getDetails(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getDetails = async url => {
    try {
      const response = await fetch(
        `/audiobay/details/${encodeURIComponent(url)}`,
        {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: `Bearer ${auth0Client.getIdToken()}`
          })
        }
      );
      const json = await response.json();
      return { status: response.ok, body: json };
    } catch (ex) {
      return false;
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookDetails;
