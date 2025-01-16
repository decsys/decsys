import PropTypes from "prop-types";
import { Flex, Tooltip, Icon } from "@chakra-ui/react";
import { FaArchive, FaCheck, FaTimes } from "react-icons/fa";
import { getContrastColor } from "services/colors";
import { FaFolder } from "react-icons/fa";

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
  archive: {
    color: "gray.500",
    label: "Archived",
    icon: FaArchive,
  },
  folder: {
    color: "gray.500",
    label: "Folder",
    icon: FaFolder,
  },
};

/**
 * A simple color and icon based indicator for showing
 * whether something is active, inactive, or archived.
 *
 * All props other than `active`, `archived`, and `tooltips` are passed on
 * to the underlying `Flex` which composes the layout of this component.
 */
const ActiveIndicator = ({ active, archived, folder, tooltips, ...p }) => {
  const state = archived
    ? statePresets.archive
    : folder
    ? statePresets.folder
    : active
    ? statePresets.active
    : statePresets.inactive;

  const tooltipLabel = folder
    ? statePresets.folder.label
    : archived
    ? "Archived"
    : tooltips[active];

  return (
    <StateIndicator
      state={{
        ...state,
        label: tooltipLabel,
      }}
      {...p}
    />
  );
};

ActiveIndicator.propTypes = {
  active: PropTypes.bool,
  archived: PropTypes.bool,
  tooltips: PropTypes.shape({
    [true]: PropTypes.string,
    [false]: PropTypes.string,
  }),
};
ActiveIndicator.defaultProps = {
  active: false,
  archived: false,
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
