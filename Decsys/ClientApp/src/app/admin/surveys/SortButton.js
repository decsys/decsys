import React from "react";
import { Button } from "@smooth-ui/core-sc";
import { CaretDown, CaretUp } from "styled-icons/fa-solid";

const SortButton = ({ onClick, sortby, current, sorter, children }) => (
  <Button
    variant="white"
    fontWeight={current.key === sortby ? "bold" : "normal"}
    onClick={() => sorter(sortby)}
  >
    {children}{" "}
    {current[sortby] ? <CaretUp size="1em" /> : <CaretDown size="1em" />}
  </Button>
);

export default SortButton;
