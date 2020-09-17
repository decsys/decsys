import { QueryParams, ClaimTypes, Roles } from "./constants";

/**
 * Get a return URL from the query string, or the passed `state`.
 *
 * Also validates it as a local URL.
 * @param {*} [state] An object with an optional `returnUrl` property
 */
export const getReturnUrl = (state) => {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get(QueryParams.ReturnUrl);
  if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
    // This is an extra check to prevent open redirects.
    throw new Error(
      "Invalid return url. The return url needs to have the same origin as the current page."
    );
  }
  return (
    (state && state.returnUrl) || fromQuery || `${window.location.origin}/`
  );
};

export const isWorkshopAdmin = window.location.hostname === "localhost";
export const isOidcAdmin = (user) => {
  if (!user) return false;
  const { profile: { [ClaimTypes.Role]: roles } = {} } = user;
  if (!roles) return false;
  if (typeof roles === "string") return roles === Roles.SurveyAdmin;
  return roles.includes(Roles.SurveyAdmin);
};
