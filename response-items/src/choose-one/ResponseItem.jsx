import { useState, createElement } from "react";
import { params } from "./ResponseItem.params";
import { filterOptions } from "./utils/option-params";
import { Flex } from "@chakra-ui/react";
import RadioList from "./components/RadioList";
import DropDownList from "./components/DropDownList";

// Main Component
const ResponseItem = ({
  _context: { logResults, setNextEnabled },
  dropDown,
  width,
  alignment,
  textColor,
  fontSize,
  fontFamily,
  ...props
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = filterOptions(props);

  const styles = {
    width,
    textColor,
    fontSize,
    fontFamily,
  };

  const align =
    { left: "flex-start", right: "flex-end" }[alignment] ?? "center";

  const handleSelection = (option) => {
    // keep our state consistent
    setSelectedOption(option);

    // also update the platform,
    setNextEnabled(true);
    if (option) {
      logResults(JSON.parse(option));
    }
  };

  const listComponent = dropDown ? DropDownList : RadioList;

  return (
    <Flex w="100%" justify={align}>
      {createElement(listComponent, {
        selectedOption,
        options,
        onSelection: handleSelection,
        ...styles,
      })}
    </Flex>
  );
};

ResponseItem.params = params;

export default ResponseItem;
