import React from "react";
import { Grid, Cell } from "styled-css-grid";
import FlexBox from "../ui/FlexBox";
import { Typography, Switch, Button } from "@smooth-ui/core-sc";
import { Copy, TrashAlt, EllipsisV } from "styled-icons/fa-solid";

const Page = ({ fixedPage, n, icon, random, title, type }) => (
  <FlexBox
    flexDirection="column"
    border={1}
    borderColor="cardBorder"
    backgroundColor="cardBg"
  >
    <FlexBox justifyContent="space-between">
      {!fixedPage && (
        <Grid
          style={{
            width: "200px",
            padding: ".5em",
            borderRight: `4px solid`,
            borderColor: "cardBorder" // TODO: fix
          }}
          columns="10px 1fr 1fr"
          rows="auto auto"
          areas={["handle number icon", "handle random random"]}
        >
          <Cell area="handle" middle>
            <EllipsisV size="1em" />
          </Cell>
          <Cell center>Q{n}</Cell>
          <Cell center>{icon}</Cell>
          <Cell area="random" center>
            <FlexBox flexDirection="column" alignItems="center">
              <Switch />
              Random
            </FlexBox>
          </Cell>
        </Grid>
      )}

      <FlexBox flexDirection="column" p={1}>
        <Typography color="gray600">{type}</Typography>
        <Typography>{title}</Typography>
      </FlexBox>

      <Grid columns="auto" rows="1fr 1fr" rowGap="0">
        <Cell>
          <Button height={1} borderRadius={0} variant="light" title="Duplicate">
            <Copy size="1em" />
          </Button>
        </Cell>
        <Cell>
          <Button height={1} borderRadius={0} variant="danger" title="Delete">
            <TrashAlt size="1em" />
          </Button>
        </Cell>
      </Grid>
    </FlexBox>
  </FlexBox>
);

export default Page;
