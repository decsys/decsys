import React from "react";
import PropTypes from "prop-types";
import { Button } from "@smooth-ui/core-sc";
import ReactTooltip from "react-tooltip";
import { CaretDown } from "styled-icons/fa-solid";
import styled from "styled-components";

let DropdownButton = ({ onClick, button, caret, tooltip, ...rest }) => {
  const ttid = `ddb${new Date().getTime()}`;

  return (
    <>
      <Button
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={onClick}
        data-tip
        data-for={ttid}
        {...rest}
      >
        {tooltip && (
          <ReactTooltip id={ttid} place={tooltip.placement} effect="solid">
            {tooltip.content}
          </ReactTooltip>
        )}
        {button}
        {caret && (
          <>
            {" "}
            <CaretDown size="1em" />
          </>
        )}
      </Button>
    </>
  );
};
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
