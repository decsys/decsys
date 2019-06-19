import React from "react";
import PropTypes from "prop-types";
import { Button, Tooltip } from "@smooth-ui/core-sc";
import { CaretDown } from "styled-icons/fa-solid";
import styled from "styled-components";

let DropdownButton = ({ onClick, button, caret, tooltip, ...rest }) => (
  <Button
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    onClick={onClick}
    {...rest}
  >
    {tooltip && (
      <Tooltip zIndex={9999} placement={tooltip.placement}>
        {tooltip.content}
      </Tooltip>
    )}
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
  caret: PropTypes.bool,
  /** Settings for a Smooth UI Tooltip */
  tooltip: PropTypes.shape({
    placement: PropTypes.oneOf(["top", "left", "right", "bottom"]),
    content: PropTypes.node
  })
};
DropdownButton.defaultProps = { caret: true };

DropdownButton = styled(DropdownButton)`
  position: relative;
`;

export default DropdownButton;
