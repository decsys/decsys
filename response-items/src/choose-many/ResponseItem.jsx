import { useEffect, useState } from "react";
import { params } from "./ResponseItem.params";
import { Flex, Checkbox } from "@chakra-ui/react";

const ResponseItem = ({
  option0,
  option1,
  option2,
  option3,
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
    <Stack spacing={5} direction="column">
      <Checkbox size="lg" isChecked={checked} onChange={handleChange}>
        {option0}
      </Checkbox>
      <Checkbox size="lg" isChecked={checked} onChange={handleChange}>
        {option1}
      </Checkbox>
      <Checkbox size="lg" isChecked={checked} onChange={handleChange}>
        {option2}
      </Checkbox>
      <Checkbox size="lg" isChecked={checked} onChange={handleChange}>
        {option3}
      </Checkbox>
    </Stack>
  );
};

ResponseItem.params = params;

export default ResponseItem;
