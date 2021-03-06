import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useLocation } from "@reach/router";
import merge from "lodash-es/merge";

const useLocationStateToast = (defaults = {}) => {
  const toast = useToast();
  const { state } = useLocation();
  useEffect(
    () => {
      if (state?.toast) toast(merge({}, defaults, state.toast));
    },
    // Don't need `override` here;
    // we don't want to retrigger the toast
    // just cos react decided to pass props again
    // eslint-disable-next-line
    [state, toast]
  );
};

export default useLocationStateToast;
