import { useLocation } from "@reach/router";
import queryString from "query-string";
import { Base64UrlToJson } from "services/data-structures";

export const useQueryString = () => queryString.parse(useLocation().search);

export const useQueryStringViewModel = (param = "ViewModel") =>
  Base64UrlToJson(useQueryString()[param]) ?? {};
