import { useState } from "react";

const useToggle = () => {
  const [toggled, setToggled] = useState(false);
  const toggle = () => setToggled(!toggled);

  return { toggled, setToggled, toggle };
};

export default useToggle;
