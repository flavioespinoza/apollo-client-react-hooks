import React from "react";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { LIST_MESSAGES } from "./MessageList";
import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  input: {
    margin: theme.spacing(1)
  }
}));

const CREATE_MESSAGE = gql`
  mutation CreateMessage($roomID: ID!, $text: String!, $username: String!) {
    createMessage(roomID: $roomID, text: $text, username: $username) {
      id
      createdAt
      text
      username
      __typename
    }
  }
`;

export default function AddMessage({ selectedRoomID }) {
  const classes = useStyles();
  const [message, setMessage] = React.useState();
  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update(
      cache,
      {
        data: { createMessage }
      }
    ) {
      const { listMessages } = cache.readQuery({
        query: LIST_MESSAGES,
        variables: { roomID: selectedRoomID }
      });
      cache.writeQuery({
        query: LIST_MESSAGES,
        variables: { roomID: selectedRoomID },
        data: {
          listMessages: [
            ...listMessages.filter(u => u.id !== createMessage.id),
            createMessage
          ]
        }
      });
    }
  });

  function handleChange(event) {
    setMessage(event.target.value);
  }

  function handleCreate(e) {
    e.preventDefault();
    createMessage({
      variables: { roomID: selectedRoomID, text: message, username: "PIGI" }
    });
    setMessage("");
  }

  return (
    <form onSubmit={handleCreate}>
      <div className={classes.container}>
        <Input
          className={classes.input}
          onChange={handleChange}
          value={message}
          fullWidth
          inputProps={{
            "aria-label": "description"
          }}
        />
      </div>
    </form>
  );
}
