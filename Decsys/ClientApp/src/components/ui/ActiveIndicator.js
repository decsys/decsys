import React from "react";
import { styled, colorYik, colorVariant } from "@smooth-ui/core-sc";
import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";
import { Check, Times } from "styled-icons/fa-solid";
import FlexBox from "./FlexBox";

const Icon = ({ active, ...p }) =>
  active ? <Check {...p} /> : <Times {...p} />;

const StyledIcon = styled(Icon)`
  color: ${p => colorYik(colorVariant(p.color)(p))(p)};
`;

/**
 * A simple color and icon based indicator for showing
 * whether something is active.
 *
 * All props other than `active` are passed on
 * to the underlying `FlexBox` which composes the layout of this component.
 */
const ActiveIndicator = ({ active, tooltips, ...rest }) => {
  const color = active ? "success" : "gray";
  const ttid = `ddb${new Date().getTime()}`;

  return (
    <>
      <FlexBox
        alignItems="center"
        p={1}
        backgroundColor={color}
        {...rest}
        data-tip
        data-for={ttid}
      >
        <StyledIcon size="1em" color={color} active={active} />
        <ReactTooltip id={ttid} effect="solid">
          {tooltips[active]}
        </ReactTooltip>
      </FlexBox>
    </>
  );
};

ActiveIndicator.propTypes = {
  active: PropTypes.bool,
  tooltips: PropTypes.shape({
    [true]: PropTypes.string,
    [false]: PropTypes.string
  })
};
ActiveIndicator.defaultProps = {
  active: false,
  tooltips: {
    [true]: "Active",
    [false]: "Inactive"
  }
};

export default ActiveIndicator;
