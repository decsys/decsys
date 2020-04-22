import React from "react";
import PropTypes from "prop-types";
import { Button } from "@smooth-ui/core-sc";
import { CaretUp, CaretDown } from "styled-icons/fa-solid";

const SortButton = ({ active, asc, children, onClick, ...rest }) => (
  <Button
    borderRadius={0}
    variant="light"
    fontWeight={active ? "bold" : "normal"}
    onClick={() => onClick(active ? !asc : asc)}
    {...rest}
  >
    {children} {asc ? <CaretUp size="1em" /> : <CaretDown size="1em" />}
  </Button>
);

SortButton.propTypes = {
  asc: PropTypes.bool,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any
};

SortButton.defaultProps = {
  asc: false
};

export default SortButton;
