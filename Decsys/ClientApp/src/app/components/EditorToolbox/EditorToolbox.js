import React from "react";
import { Typography } from "@smooth-ui/core-sc";
import { FlexBox } from "../../components/ui";
import Component from "./Component";

// TODO: PropTypes

const EditorToolbox = ({ components }) => (
  <FlexBox flexDirection="column" px={2}>
    <Typography textAlign="center" width={1} p={1}>
      Components
    </Typography>
    {components.map(({ type, icon }) => (
      <Component key={type} name={type} icon={icon} />
    ))}
  </FlexBox>
);

export default EditorToolbox;
