import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

const CHANGE_SELECTED_ROOM = gql`
  mutation ChangeSelectedRoom($roomID: ID!) {
    changeSelectedRoom(roomID: $roomID) @client
  }
`;

const ChartRoom = ({ classes, room, selected = false }) => {
  const [changeSelectedRoom] = useMutation(CHANGE_SELECTED_ROOM);
  return (
    <ListItem
      alignItems="flex-start"
      button
      onClick={() => changeSelectedRoom({ variables: { roomID: room.id } })}
      selected={selected}
    >
      <ListItemAvatar>
        <Avatar alt={room.name}>
          {room.name
            .split(/\s/)
            .reduce((a, w) => a + w.slice(0, 1), "")
            .slice(0, 2)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={room.name}
        secondary={
          room.latest_message ? (
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {room.latest_message.username}
              </Typography>
              {` - ${new Date(
                room.latest_message.createdAt
              ).toLocaleString()} - `}
              {room.latest_message.text}
            </React.Fragment>
          ) : (
            "Send first Message"
          )
        }
      />
    </ListItem>
  );
};

export default ChartRoom;
