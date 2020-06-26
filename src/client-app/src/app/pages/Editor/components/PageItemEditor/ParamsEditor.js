import React from "react";
import Param from "./Param";
import { Grid, Text } from "@chakra-ui/core";

const ParamsEditor = ({ component, params, onParamChange }) => {
  if (!component) return null;

  const list = [];
  for (const key in component.params) {
    const p = component.params[key];
    list.push([
      <Text key={`${key}-label`} textAlign="right" fontWeight="bold">
        {p.label}
      </Text>,
      <Param
        key={`${key}-value`}
        value={params[key] || p.defaultValue}
        type={p.type}
        paramKey={key}
        oneOf={p.oneOf}
        onChange={onParamChange}
      />
    ]);
  }

  return (
    <Grid templateColumns="2fr 5fr" gridRowGap=".2em">
      {list}
    </Grid>
  );
};

export default ParamsEditor;
