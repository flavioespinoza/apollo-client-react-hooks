import gql from "graphql-tag";

export default gql`
  extend type Query {
    selectedRoomID: ID
  }
  extend type Mutation {
    changeSelectedRoom(roomID: ID!): ID
  }
`;
