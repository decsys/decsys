import PropTypes from "prop-types";
import { Flex, Tooltip, useTheme, Icon } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getContrastColor } from "services/colors";

/**
 * A simple color and icon based indicator for showing
 * whether something is active.
 *
 * All props other than `active` and `tooltips` are passed on
 * to the underlying `Flex` which composes the layout of this component.
 */
const ActiveIndicator = ({ active, tooltips, ...p }) => {
  const { colors } = useTheme();
  const color = active ? colors.green[500] : colors.gray[500];
  const iconColor = getContrastColor(color);
  const icon = active ? FaCheck : FaTimes;

  return (
    <Tooltip hasArrow label={tooltips[active]}>
      <Flex align="center" p={2} bg={color} {...p}>
        <Icon as={icon} color={iconColor} />
      </Flex>
    </Tooltip>
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

export default ActiveIndicator;
