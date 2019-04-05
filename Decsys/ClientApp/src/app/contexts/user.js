import { createContext } from "react";

const userContext = createContext({
  localhost: false,
  user: { roles: [] },
  instances: {},
  anonymousInstance: () => {},
  pseudoAnonymousInstance: () => {}
});

export default userContext;
