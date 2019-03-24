import React from "react";
import { FlexBox } from "../ui";
import Param from "./Param";
import { Grid, Cell } from "styled-css-grid";
import { Typography } from "@smooth-ui/core-sc";

const ComponentEditor = ({ component, params }) => {
  const list = [];
  for (const key in component.params) {
    const p = component.params[key];
    list.push(
      <>
        <Typography textAlign="right" fontWeight="bold">
          {p.label}
        </Typography>
        <Param
          value={params[key] || p.defaultValue}
          type={p.type}
          paramKey={key}
          oneOf={p.oneOf}
        />
      </>
    );
  }

  return (
    <Grid columns="1fr 5fr" rowGap=".2em">
      {list}
    </Grid>
  );
};

export default ComponentEditor;
