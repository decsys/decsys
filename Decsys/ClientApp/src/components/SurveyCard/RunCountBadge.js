import React from "react";
import { Typography } from "@smooth-ui/core-sc";
import { Badge } from "components/core";

const RunCountBadge = ({ count = 0 }) => (
  <Badge backgroundColor="info">
    {count}
    <Typography display={{ xs: "none", md: "inline" }}> runs</Typography>
  </Badge>
);

export default RunCountBadge;
