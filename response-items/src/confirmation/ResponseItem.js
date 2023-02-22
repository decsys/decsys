import { useEffect, useState } from "react";
import { params } from "./ResponseItem.params";
import { Flex, Checkbox } from "@chakra-ui/react";

const ResponseItem = ({
  label,
  confirmed: initialChecked,
  _context: { setNextEnabled, logResults },
}) => {
  const [checked, setChecked] = useState(initialChecked);
  useEffect(() => setNextEnabled(!!checked), [checked]);

  const handleChange = (e) => {
    logResults({ confirmed: e.target.checked });
    setChecked(e.target.checked);
  };

  return (
    <Flex>
      <Checkbox size="lg" isChecked={checked} onChange={handleChange}>
        {label}
      </Checkbox>
    </Flex>
  );
};

ResponseItem.params = params;

export default ResponseItem;
