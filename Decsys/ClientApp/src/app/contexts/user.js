import { createContext } from "react";

const userContext = createContext({
  localhost: false,
  user: { roles: [] },
  instances: {},
  checkLocalAdmin: () => {},
  anonymousInstance: () => {},
  pseudoAnonymousInstance: () => {}
});

export const UserProvider = userContext.Provider;
export const UserConsumer = userContext.Consumer;
