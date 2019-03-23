import React from "react";
import FlexBox from "../ui/FlexBox";
import { Typography } from "@smooth-ui/core-sc";

const EditorPageList = () => (
  <FlexBox flexDirection="column" px={2}>
    <Typography textAlign="center" width={1} p={1}>
      Pages
    </Typography>
    {pages.map(x => {
      return <Page />;
    })}
  </FlexBox>
);

export default EditorPageList;
