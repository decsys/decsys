import React from "react";
import FlexBox from "../ui/FlexBox";
import { Typography } from "@smooth-ui/core-sc";
import { CircleNotch } from "styled-icons/fa-solid";
import { DotCircle } from "styled-icons/fa-regular";
import Page from "./Page";

const EditorPageList = () => (
  <FlexBox flexDirection="column" px={2}>
    <Typography textAlign="center" width={1} p={1}>
      Survey structure
    </Typography>
    <Page type="Welcome" title="Welcome" fixedPage />
    <Page
      type="Ellipse"
      title="What's the difference between a duck?"
      icon={<CircleNotch size="1em" />}
      n={1}
      random={false}
    />
    <Page
      type="Likert"
      title="Which radio button is your favourite?"
      icon={<DotCircle size="1em" />}
      n={2}
      random
    />
    <Page type="ThankYou" title="Thank you" fixedPage />
  </FlexBox>
);

export default EditorPageList;
