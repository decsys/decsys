import { useState } from "react";

/**
 * returns a function to run an action
 * after a delay; the delay is reset if the function is called again
 * before the timer expires.
 * @param {*} f
 * @param {*} delay
 */
const useDeferredAction = (f, delay = 1000) => {
  const [timer, setTimer] = useState();

  return (...args) => {
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => f(...args), delay));
  };
};

export default useDeferredAction;
