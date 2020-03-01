import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BookDetails from "./BookDetails";
import auth0Client from "../utils/auth";

const DisplayCard: React.FC<any> = ({ title, url, image, details }) => {
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState("");
  const [infoHash, setInfoHash] = useState("");

  const handleExpandClick = async () => {
    const details: any = await getDetails(url);
    console.log("Details", details);

    setDescription(details.description);
    setInfoHash(details.infoHash);

    setExpanded(!expanded);
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
      return json[0];
    } catch (ex) {
      return false;
    }
  };

  const useStyles = makeStyles(theme => ({
    root: {
      maxWidth: 345
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: red[500]
    }
  }));
  const classes = useStyles();

  return (
    <Card
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column"
      }}
      className={classes.root}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        title={title}
      />
      <CardMedia className={classes.media} image={image} title="Book" />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {details}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" href={url}>
          <FavoriteIcon />
        </IconButton>

        <BookDetails url={url}></BookDetails>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} unmountOnExit>
        <CardContent>
          {console.log("info", infoHash)}
          <Typography variant="h4">{infoHash}</Typography>
          <Typography paragraph>{description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default DisplayCard;
