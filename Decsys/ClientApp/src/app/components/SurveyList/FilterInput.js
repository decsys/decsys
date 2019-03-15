import React from "react";
import { Input } from "@smooth-ui/core-sc";

const FilterInput = ({ filter, ...p }) => (
  <Input placeholder="Filter" value={filter} {...p} />
);

export default FilterInput;
