import React from "react";
import { Box } from "@smooth-ui/core-sc";

const RunCountBadge = ({ count }) => (
  <Box
    backgroundColor="info"
    display="inline-block"
    px=".5em"
    borderRadius="8px"
    color="white"
    mr="1em"
  >
    {count}
    <Box uiAs="span" display={{ xs: "none", md: "inline" }}>
      {" "}
      runs
    </Box>
  </Box>
);

export default RunCountBadge;
