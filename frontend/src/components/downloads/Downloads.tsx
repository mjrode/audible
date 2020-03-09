import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const Downloads: React.FC<any> = ({ url }) => {
  const getDownloads = async url => {
    try {
      const response = await fetch("/transmission/status/", {
        method: "get",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json"
        })
      });
      const json = await response.json();
      return { status: response.ok, body: json };
    } catch (ex) {
      return false;
    }
  };

  return (
    <div>
      <p>Hello</p>
    </div>
  );
};

export default Downloads;
