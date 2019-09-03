import React from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

function IncCounter() {
  const [incCounter] = useMutation(INC_COUNTER);
  return <button onClick={incCounter}>+</button>;
}
function Counter() {
  const { loading, error, data } = useQuery(GET_COUNTER);
  if (loading) return "Loading...";
  if (error) return error;

  const { counter } = data;

  return (
    <div>
      <h1>{counter}</h1>
      <IncCounter />
    </div>
  );
}

const INC_COUNTER = gql`
  mutation {
    inc @client
  }
`;

const GET_COUNTER = gql`
  {
    counter @client
  }
`;

export default Counter;
