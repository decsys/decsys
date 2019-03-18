import React from "react";
import PropTypes from "prop-types";
import { Button } from "@smooth-ui/core-sc";
import { CaretDown } from "styled-icons/fa-solid";
import styled from "styled-components";

let DropdownButton = ({ onClick, button, caret, ...rest }) => (
  <Button
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    onClick={onClick}
    {...rest}
  >
    {button}
    {caret && (
      <>
        {" "}
        <CaretDown size="1em" />
      </>
    )}
  </Button>
);
DropdownButton.propTypes = {
  /** The actual button contents */
  button: PropTypes.node,
  /** Whether to automatically display a downwards arrow after the content */
  caret: PropTypes.bool
};
DropdownButton.defaultProps = { caret: true };

DropdownButton = styled(DropdownButton)`
  position: relative;
`;

export default DropdownButton;
