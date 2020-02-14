import { useReducer, useEffect, useRef } from "react";
import { useNavigation } from "react-navi";

const thunkedDispatch = (dispatch, ...otherArgs) => thunk =>
  typeof thunk === "function"
    ? dispatch(thunk(thunkedDispatch(dispatch, ...otherArgs), ...otherArgs))
    : dispatch(thunk);

export const useThunkReducer = (reducer, initArg, init) => {
  const [state, dispatch] = useReducer(reducer, initArg, init);
  return [state, thunkedDispatch(dispatch)];
};

export const useNaviReducer = (reducer, initArg, init) => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initArg, init);
  return [state, thunkedDispatch(dispatch, navigation)];
};

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
