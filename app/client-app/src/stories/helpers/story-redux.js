import React from "react";
import { Provider } from "react-redux";
import { decorate } from "@storybook/addon-actions";

// TODO: there should be a way to make this nice, one day
export const dispatchAction = decorate([args => [args[0].name, args[0]]]);

// mock the simplest redux store so connect() works for children that need it
export const basicStore = state => ({
  getState: () => state,
  subscribe: () => 0,
  dispatch: dispatchAction.action("Redux action dispatched")
});

// Storybook Decorators for using the stuff above
export const withStore = store => story => (
  <Provider store={store}>{story()}</Provider>
);

export const withBasicStore = (state = {}) => withStore(basicStore(state));
