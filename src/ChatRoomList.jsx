import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChartRoom from "./ChatRoom";
import AddRoom from "./AddRoom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    // maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  },
  progress: {
    margin: theme.spacing(2)
  }
}));

export const LIST_ROOMS = gql`
  {
    listRooms {
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
    selectedRoomID @client
  }
`;

const ChartRoomList = () => {
  const classes = useStyles();
  const { loading, error, data, subscribeToMore } = useQuery(LIST_ROOMS);

  useEffect(() => {
    subscribeToMore({
      document: gql`
        subscription subscribeNewRoom {
          subscribeNewRoom {
            id
            name
            latest_message {
              username
              text
              createdAt
              __typename
            }
          }
        }
      `,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const {
          data: { subscribeNewRoom }
        } = subscriptionData;
        console.log(subscribeNewRoom);
        const listRooms = prev.listRooms.filter(
          u => u.id !== subscribeNewRoom.id
        );
        return Object.assign({}, prev, {
          listRooms: [subscribeNewRoom, ...listRooms]
        });
      }
    });
  }, []);

  if (loading) return <CircularProgress className={classes.progress} />;
  if (error) return <p>error</p>;

  var { listRooms, selectedRoomID } = data;
  return (
    <React.Fragment>
      <List className={classes.root}>
        {listRooms.map((room, i) => {
          return (
            <React.Fragment key={room.id}>
              <ChartRoom
                key={room.id}
                classes={classes}
                room={room}
                selected={room.id === selectedRoomID}
              />
              {listRooms.length - 1 !== i ? (
                <Divider variant="inset" component="li" />
              ) : null}
            </React.Fragment>
          );
        })}
      </List>
      <AddRoom />
    </React.Fragment>
  );
};

export default ChartRoomList;
