import React from "react";
import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";

// mock the simplest redux store so connect() works for children that need it
export const BasicStore = {
  getState: () => ({}),
  subscribe: () => 0,
  dispatch: action("Redux action dispatched")
};

// Storybook Decorators for using the stuff above
export const withStore = store => story => (
  <Provider store={store}>{story()}</Provider>
);

export const withBasicStore = withStore(BasicStore);
