import gql from "graphql-tag";
import { LIST_MESSAGES } from "../MessageList";

export default {
  Mutation: {
    changeSelectedRoom: (_, { roomID }, { cache }) => {
      cache.writeData({ data: { selectedRoomID: roomID } });
      return roomID;
    }
  }
};
