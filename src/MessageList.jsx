import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddMessage from "./AddMessage";

const GET_SELECTED_ROOM_ID = gql`
  {
    selectedRoomID @client
  }
`;
export const LIST_MESSAGES = gql`
  query ListMessages($roomID: ID!) {
    listMessages(roomID: $roomID) {
      id
      createdAt
      text
      username
      __typename
    }
  }
`;

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2)
  },
  list: {
    maxHeight: "80vh",
    overflow: "auto"
  }
}));

const SelectedRoom = () => {
  const {
    data: { selectedRoomID }
  } = useQuery(GET_SELECTED_ROOM_ID);
  if (!selectedRoomID) return <p>Select Room</p>;
  return (
    <React.Fragment>
      <MessageList selectedRoomID={selectedRoomID} />
      <AddMessage selectedRoomID={selectedRoomID} />
    </React.Fragment>
  );
};

const MessageList = ({ selectedRoomID }) => {
  const bottomRef = useRef(null);
  const classes = useStyles();
  const { loading, error, data, subscribeToMore } = useQuery(LIST_MESSAGES, {
    variables: { roomID: selectedRoomID },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    // bottomRef.current.scrollIntoView({ behavior: "smooth" });
    subscribeToMore({
      document: gql`
        subscription subscribeNewMessage($roomID: ID!) {
          subscribeNewMessage(roomID: $roomID) {
            id
            username
            text
            createdAt
            __typename
          }
        }
      `,
      variables: { roomID: selectedRoomID },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          data: { subscribeNewMessage }
        } = subscriptionData;
        const listMessages = prev.listMessages.filter(
          u => u.id !== subscribeNewMessage.id
        );
        return Object.assign({}, prev, {
          listMessages: [...listMessages, subscribeNewMessage]
        });
      }
    });
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data.listMessages]);

  if (loading || !data)
    return <CircularProgress className={classes.progress} />;
  if (error) return <p>error</p>;
  const { listMessages } = data;
  if (!listMessages.length) {
    return <p>No Messages</p>;
  }

  return (
    <List dense className={classes.list}>
      {listMessages.map(message => (
        <ListItem key={message.id}>
          <ListItemAvatar>
            <Avatar>{/* <FolderIcon /> */}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={message.text} />
        </ListItem>
      ))}
      <div ref={bottomRef} />
    </List>
  );
};

export default SelectedRoom;
