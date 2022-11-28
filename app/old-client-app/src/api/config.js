import useSWR from "swr";
import { defaultFetcher } from "./helpers";

export const useServerConfig = () => {
  const { error, data } = useSWR("/api/config", defaultFetcher(), {
    suspense: true,
  });

  if (error) throw new Error(error);
  return data;
};
