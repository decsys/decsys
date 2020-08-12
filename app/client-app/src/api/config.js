import useSWR from "swr";
import { defaultFetcher } from "./helpers";

export const useDecsysAppMode = () =>
  useSWR("/api/config", defaultFetcher(), { suspense: true });
