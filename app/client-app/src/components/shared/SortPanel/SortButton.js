import PropTypes from "prop-types";
import { Button } from "@chakra-ui/react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

const SortButton = ({ active, asc, children, onClick, ...rest }) => (
  <Button
    rightIcon={asc ? <FaCaretUp /> : <FaCaretDown />}
    _focus={{}}
    lineHeight="inherit"
    borderRadius={0}
    fontWeight={active ? "bold" : "normal"}
    onClick={() => onClick(active ? !asc : asc)}
    {...rest}
  >
    {children}
  </Button>
);

SortButton.propTypes = {
  asc: PropTypes.bool,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
};

SortButton.defaultProps = {
  asc: false,
};

export default SortButton;
