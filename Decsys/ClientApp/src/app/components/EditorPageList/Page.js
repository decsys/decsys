import React from "react";
import { Grid, Cell } from "styled-css-grid";
import FlexBox from "../ui/FlexBox";
import { Typography, Switch, Button } from "@smooth-ui/core-sc";
import { Copy, TrashAlt, EllipsisV } from "styled-icons/fa-solid";
import PageHeader from "./PageHeader";
import PageComponent from "./PageComponent";
import PageItem from "./PageItem";

const Page = ({ components, componentList, n }) => {
  const isResponse = type => !["heading", "paragraph", "image"].includes(type);
  return (
    <FlexBox
      flexDirection="column"
      border={1}
      borderColor="cardBorder"
      backgroundColor="cardBg"
    >
      <PageHeader n={n} />

      {components.map(x =>
        isResponse(x.type) ? (
          <PageComponent components={componentList} currentType={x.type} />
        ) : (
          <PageItem type={x.type} text={x.text} />
        )
      )}
      {components.every(x => !isResponse(x.type)) && (
        <PageComponent components={componentList} />
      )}
    </FlexBox>
  );
};

export default Page;
