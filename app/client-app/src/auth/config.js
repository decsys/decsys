import { Paths, ApplicationName } from "./constants";
import { WebStorageStateStore } from "oidc-client";

export const config = {
  oidc: {
    authority: Paths.Origin,
    client_id: "decsys-client-app",
    redirect_uri: `${Paths.Origin}${Paths.CompleteSignIn(true)}`,
    response_type: "code",
    response_mode: "query",
    scope: "openid profile email extended_profile survey.admin",
    automaticSilentRenew: true,
    includeIdTokenInSilentRenew: true,
    userStore: new WebStorageStateStore({
      prefix: `${ApplicationName}.`,
    }),
  },
};
