import React from "react";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { LIST_ROOMS } from "./ChatRoomList";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const CREATE_ROOM = gql`
  mutation AddRoom($name: String!) {
    createRoom(name: $name) {
      id
      name
      latest_message {
        username
        text
        createdAt
        __typename
      }
      __typename
    }
  }
`;

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [groupName, setGroupName] = React.useState("default");
  const [createRoom] = useMutation(CREATE_ROOM, {
    update(
      cache,
      {
        data: { createRoom }
      }
    ) {
      const { listRooms } = cache.readQuery({ query: LIST_ROOMS });
      cache.writeQuery({
        query: LIST_ROOMS,
        data: {
          listRooms: [
            ...listRooms.filter(u => u.id !== createRoom.id),
            createRoom
          ]
        }
      });
    }
  });

  function handleChangeStateGroupName(event) {
    setGroupName(event.target.value);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleAdd() {
    createRoom({ variables: { name: groupName } });
    setGroupName("");
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Room
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Room</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter your group name here.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Group Name"
            type="text"
            fullWidth
            onChange={handleChangeStateGroupName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
