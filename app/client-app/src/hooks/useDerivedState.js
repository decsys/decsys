import { useState } from "react";
import { isEqual } from "lodash-es";

// https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops

/**
 * Derive State from Props.
 *
 * This hook is intended for use with single prop values,
 * Or very simple calculations (such as defaulting nullish props).
 *
 * Complex calculations or derived results (e.g. large arrays or objects) WILL be inefficient.
 *
 * If deriver is a function, it is run EVERY RENDER.
 *
 * If this is a problem, use `useEffect` for more control instead.
 * @param {function|*} deriver Either the value (e.g. prop value) to use as the derived state,
 * or a function for calculating derived state
 * @param {*} args arguments to the deriver function. Usually a props object.
 */
export const useDerivedState = (deriver, args) => {
  const derived = typeof deriver === "function" ? deriver(args) : deriver;
  const [prevDerived, setPrevDerived] = useState();

  const [state, setState] = useState(derived);

  // we can't just compare against `state`,
  // because that can be changed externally
  // by `setState` which we return
  if (!isEqual(derived, prevDerived)) {
    setPrevDerived(derived); // but only we can update prevDerived ;)
    setState(derived);
  } // TODO: support custom condition?

  return [state, setState];
};
