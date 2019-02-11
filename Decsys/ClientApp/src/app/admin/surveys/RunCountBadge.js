import React from "react";
import { Typography } from "@smooth-ui/core-sc";

const RunCountBadge = ({ count }) => (
  <Typography
    display="inline"
    backgroundColor="info"
    px={1}
    borderRadius={8}
    color="white"
  >
    {count}
    <Typography display={{ xs: "none", md: "inline" }}> runs</Typography>
  </Typography>
);

export default RunCountBadge;
