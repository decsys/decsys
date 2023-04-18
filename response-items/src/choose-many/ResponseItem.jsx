import { useState, createElement } from "react";
import { params } from "./ResponseItem.params";
import { filterOptions } from "../Choose-one/utils/option-params";
import { Flex } from "@chakra-ui/react";
import CheckboxList from "./components/CheckboxList";

const ResponseItem = ({
  confirmed: initialChecked,
  alignment,
  textColor,
  fontSize,
  fontFamily,
  colorScheme,
  ...props
}) => {
  const options = filterOptions(props);

  const align =
    { left: "flex-start", right: "flex-end" }[alignment] ?? "center";

  const styles = {
    textColor,
    fontSize,
    fontFamily,
    colorScheme,
  };

  return (
    <Flex w="100%" justify={align}>
      {createElement(CheckboxList, {
        options,
        ...styles,
      })}
    </Flex>
  );
};

ResponseItem.params = params;

export default ResponseItem;
