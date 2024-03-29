import Param from "./Param";
import { Grid, Text } from "@chakra-ui/react";

const ParamsEditor = ({ component, params, handleParamChange }) => {
  if (!component) return null;

  const list = [];
  for (const key in component.params) {
    const p = component.params[key];
    if (!p) continue;
    list.push([
      <Text
        key={`${component.id}-${key}-label`}
        textAlign="right"
        fontWeight="bold"
      >
        {p.label}
      </Text>,
      <Param
        key={`${component.id}-${key}-value`}
        value={params[key] || (p.defaultValue ?? "")}
        type={p.type}
        paramKey={key}
        oneOf={p.oneOf}
        onChange={handleParamChange}
      />,
    ]);
  }

  return (
    <Grid
      templateColumns="2fr 5fr"
      gap={2}
      alignItems="center"
      width="100%"
      p={2}
    >
      {list}
    </Grid>
  );
};

export default ParamsEditor;
