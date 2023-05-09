import { useEffect, useState } from "react";
import { params } from "./ResponseItem.params";
import { Flex, Checkbox } from "@chakra-ui/react";

const ResponseItem = ({
  label,
  confirmed: initialChecked,
  _context: { setIsValidResponse, logResults, clearResult },
}) => {
  const [checked, setChecked] = useState(initialChecked);
  useEffect(() => setIsValidResponse(!!checked), [checked]);

  const handleChange = (e) => {
    logResults({ confirmed: e.target.checked });
    setChecked(e.target.checked);
  };

  if (!checked) {
    clearResult();
  }

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
