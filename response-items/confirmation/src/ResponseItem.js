import React, { useEffect, useState } from "react";
import * as props from "./ResponseItem.props";
import { Flex } from "@chakra-ui/layout";
import { Checkbox } from "@chakra-ui/checkbox";

const ResponseItem = ({
  label,
  confirmed: initialChecked,
  setNextEnabled,
  logResults,
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

ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;

export default ResponseItem;
