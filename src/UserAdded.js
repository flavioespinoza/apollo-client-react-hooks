import React from "react";
import gql from "graphql-tag";
import { useSubscription } from "@apollo/react-hooks";

const USER_ADDED_SUBSCRIPTION = gql`
  subscription userAdded {
    userAdded {
      id
      name
    }
  }
`;

function UserAdded() {
  const { data, loading } = useSubscription(USER_ADDED_SUBSCRIPTION, {
    shouldResubscribe: true
  });
  if (loading) return "Loading...";
  console.log("new user", data);
  const { userAdded } = data;
  return <h4>New user: {userAdded ? userAdded.name : "-"}</h4>;
}

export default UserAdded;
