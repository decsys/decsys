import { useState } from "react";

/**
 * when you want to toggle a boolean state.
 *
 * saves you writing a `toggle()` function :)
 * @param {boolean} initial the initial state value
 * @returns {[]} `[toggleState, toggle(), setState()]`
 */
const useToggle = (initial = false) => {
  const [isOn, setIsOn] = useState(initial);
  const toggle = () => setIsOn(!isOn);

  return [isOn, toggle, setIsOn];
};

export default useToggle;
