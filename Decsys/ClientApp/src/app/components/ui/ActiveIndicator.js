import React from "react";
import { styled, colorYik, colorVariant } from "@smooth-ui/core-sc";
import PropTypes from "prop-types";
import { Check, Times } from "styled-icons/fa-solid";
import FlexBox from "./FlexBox";

/**
 * A simple color and icon based indicator for showing
 * whether something is active.
 *
 * All props other than `active` are passed on
 * to the underlying `FlexBox` which composes the layout of this component.
 */
const ActiveIndicator = ({ active, ...rest }) => {
  const color = active ? "success" : "gray";

  const Icon = styled(active ? Check : Times)`
    color: ${p => colorYik(colorVariant(color)(p))(p)};
  `;

  return (
    <FlexBox
      alignItems="center"
      p={1}
      backgroundColor={color}
      title={active ? "Active" : "Inactive"}
      {...rest}
    >
      <Icon size="1em" />
    </FlexBox>
  );
};

ActiveIndicator.propTypes = {
  active: PropTypes.bool
};
ActiveIndicator.defaultProps = {
  active: false
};

export default ActiveIndicator;
