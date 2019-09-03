import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import Counter from "./Counter";

import resolvers from "./local/resolvers";
import defaults from "./local/defaults";
import typeDefs from "./local/typeDef";
import Chat from "./Chat";
import "./styles.css";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink, split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
import { onError } from "apollo-link-error";

const cache = new InMemoryCache();
const wsLink = new WebSocketLink({
  uri: "wss://mlu6t.sse.codesandbox.io/graphql",
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({
  uri: "https://mlu6t.sse.codesandbox.io/"
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: ApolloLink.from([
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    ),
    errorLink
  ]),
  cache,
  resolvers,
  typeDefs
});
// load initial data to local storae
cache.writeData({
  data: defaults
});

function App() {
  return (
    <ApolloProvider client={client}>
      {/* <Counter /> */}
      <Chat />
    </ApolloProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
