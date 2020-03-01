import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Button,
  Input,
  makeStyles
} from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import auth0Client from "../../utils/auth";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

export interface IValues {
  title: string;
  author: string;
}

export interface IResults {
  title: string;
  link: string;
  image: string;
}

export interface IFormState {
  [key: string]: any;
  values: IValues[];
  submitSuccess?: boolean;
  loading: boolean;
  results: IResults[];
}

// class Create extends React.Component<{} & RouteComponentProps, IFormState> {

const Create: React.FC<any> = () => {
  const [values, setValues] = useState<any>([]);
  const [title, setTitle] = useState<string>("");
  const [results, setResults] = useState<Array<IResults>>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const handleFormSubmission = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    const response: any = await submitForm();
    console.log(response);
    setSubmitSuccess(response.status);
    setLoading(false);
    setResults(response.body);
  };

  const submitForm = async () => {
    try {
      console.log("title", title);
      const response = await fetch(`/audiobay/${title}`, {
        method: "get",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: `Bearer ${auth0Client.getIdToken()}`
        })
      });
      const json = await response.json();
      return { status: response.ok, body: json };
    } catch (ex) {
      return false;
    }
  };

  const handleInputChanges = (event: React.ChangeEvent<{}>) => {
    const { value } = event.target as HTMLInputElement;
    console.log("title", title);
    setTitle(value);
  };

  // const handleInputChanges = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   e.preventDefault();
  //   console.log("Values", values);
  //   setValues({ ...values, [e.currentTarget.name]: e.currentTarget.value });
  // };

  return (
    <div>
      <h2>Search for Books</h2>

      <form
        id={"create-post-form"}
        onSubmit={handleFormSubmission}
        noValidate={true}
      >
        <FormControl>
          <TextField
            value={title}
            label="Title"
            type="text"
            id="title"
            onChange={handleInputChanges}
            name="title"
          />
        </FormControl>

        <Button variant="outlined" type="submit">
          Search Books
        </Button>

        {loading && <span className="fa fa-circle-o-notch fa-spin" />}
      </form>

      {submitSuccess && !loading && (
        <List>
          {results.map(result => (
            <ListItem key={result.title} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={result.image} />
              </ListItemAvatar>
              <ListItemText
                primary={result.title}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      description
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}

          <Divider variant="inset" component="li" />
        </List>
      )}
    </div>
  );
};

export default withRouter(Create);
