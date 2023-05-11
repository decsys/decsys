import { useState } from "react";
import { params } from "./ResponseItem.params";
import { Flex, Checkbox } from "@chakra-ui/react";

const ResponseItem = ({
  label,
  confirmed: initialChecked,
  _context: { setIsValidResponse, logResults, clearResult },
}) => {
  const [checked, setChecked] = useState(initialChecked);

  const handleChange = (e) => {
    if (e.target.checked) {
      logResults({ confirmed: true });
      setChecked(e.target.checked);
      setIsValidResponse(true);
    } else if (!e.target.checked) {
      clearResult();
    }
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
