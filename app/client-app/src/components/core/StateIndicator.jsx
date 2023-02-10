import PropTypes from "prop-types";
import { Flex, Tooltip, Icon } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getContrastColor } from "services/colors";

const statePresets = {
  active: {
    color: "green.500",
    label: "Active",
    icon: FaCheck,
  },
  inactive: {
    color: "gray.500",
    label: "Inactive",
    icon: FaTimes,
  },
};

/**
 * A simple color and icon based indicator for showing
 * whether something is active.
 *
 * All props other than `active` and `tooltips` are passed on
 * to the underlying `Flex` which composes the layout of this component.
 */
const ActiveIndicator = ({ active, tooltips, ...p }) => {
  return (
    <StateIndicator
      state={{
        ...(active ? statePresets.active : statePresets.inactive),
        label: tooltips[active],
      }}
      {...p}
    />
  );
};

ActiveIndicator.propTypes = {
  active: PropTypes.bool,
  tooltips: PropTypes.shape({
    [true]: PropTypes.string,
    [false]: PropTypes.string,
  }),
};
ActiveIndicator.defaultProps = {
  active: false,
  tooltips: {
    [true]: "Active",
    [false]: "Inactive",
  },
};

const StateIndicator = ({ state, ...p }) => {
  const iconColor = getContrastColor(state.color);

  const indicator = (
    <Flex align="center" p={2} bg={state.color} {...p}>
      {state.icon && <Icon as={state.icon} color={iconColor} />}
    </Flex>
  );
  return state.label ? (
    <Tooltip hasArrow label={state.label}>
      {indicator}
    </Tooltip>
  ) : (
    indicator
  );
};

StateIndicator.propTypes = {
  state: PropTypes.shape({
    color: PropTypes.string.isRequired,
    label: PropTypes.string,
    icon: PropTypes.elementType,
  }),
};

export { StateIndicator, ActiveIndicator, statePresets };
