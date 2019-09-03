import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

function User({ id }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: {
      id
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  const { getUser } = data;

  return <h1>{getUser.name}</h1>;
}

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      __typename
    }
  }
`;

export default User;
