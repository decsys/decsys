import useSWR from "swr";
import { defaultFetcher } from "./helpers";

// TOOD: think about reuse of urls...
export const useInstanceValidIds = (surveyId, instanceId) =>
  useSWR(`/api/surveys/${surveyId}/instances/${instanceId}`, defaultFetcher, {
    suspense: true
  });
