import { useEffect, useState } from "react";

/**
 * useState but the value is based on a prop
 * and the state refreshes when the prop does
 * @param {*} prop
 */
const useFreshPropState = prop => {
  const [value, setValue] = useState(prop);
  useEffect(() => {
    setValue(prop);
  }, [prop]);

  return [value, setValue];
};

export default useFreshPropState;
