import React from "react";
import FlexBox from "../ui/FlexBox";
import { Typography } from "@smooth-ui/core-sc";
import { CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";
import Page from "./Page";

const EditorPageList = () => (
  <FlexBox flexDirection="column" px={2}>
    <Typography textAlign="center" width={1} p={1}>
      Pages
    </Typography>
  </FlexBox>
);

export default EditorPageList;
