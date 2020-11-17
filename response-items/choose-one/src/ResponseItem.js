import { useState } from "react";
import * as props from "./ResponseItem.props";
import { filterOptions } from "./utils/option-params";
import { Flex } from "@chakra-ui/react";
import RadioList from "./components/RadioList";

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

  const handleSelection = (option) => {
    // keep our state consistent
    setSelectedOption(option);

    // also update the platform
    setNextEnabled(true);
    logResults(JSON.parse(option));
  };

  const align =
    { left: "flex-start", right: "flex-end" }[alignment] ?? "center";

  return (
    <Flex w="100%" justify={align}>
      <RadioList
        selectedOption={selectedOption}
        options={options}
        onSelection={handleSelection}
        {...styles}
      />
    </Flex>
    // <FlexBox alignment={alignment}>
    //   {dropDown ? (
    //     <DropDownList options={options} onSelection={logOption} {...styles} />
    //   ) : (
    //   )}
    // </FlexBox>
  );
};

// Props metadata - Edit these in `./Component.props.js`
ResponseItem.params = props.params;
ResponseItem.propTypes = props.propTypes;
ResponseItem.defaultProps = props.defaultProps;

export default ResponseItem;
