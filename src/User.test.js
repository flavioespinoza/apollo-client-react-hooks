import React from "react";
import renderer from "react-test-renderer";
import wait from "waait";

import User, { GET_USER } from "./User";

import { MockedProvider } from "@apollo/react-testing";

it("should render without error", () => {
  const component = renderer.create(
    <MockedProvider mocks={[]}>
      <User id={1} />
    </MockedProvider>
  );
  const tree = component.toJSON();
  expect(tree.children).not.toBeUndefined();
});

it("should render Tomi", async () => {
  const userMock = {
    request: {
      query: GET_USER,
      variables: { id: 1 }
    },
    result: {
      data: { getUser: { id: 1, name: "Tomi", __typename: "User" } }
    }
  };

  const component = renderer.create(
    <MockedProvider mocks={[userMock]} addTypename={true}>
      <User id={1} />
    </MockedProvider>
  );

  await wait(0);

  const h1 = component.root.findByType("h1");
  expect(h1.children).toContain("Tomi");
});

it("should handle error", async () => {
  const userMock = {
    request: {
      query: GET_USER,
      variables: { id: 1 }
    },
    error: new Error("user not found")
  };

  const component = renderer.create(
    <MockedProvider mocks={[userMock]} addTypename={false}>
      <User id={1} />
    </MockedProvider>
  );

  await wait(0);

  const tree = component.toJSON();
  expect(tree.children).toContain("Error");
});
