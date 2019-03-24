import React, { cloneElement } from "react";

const ComponentRender = ({ component, params }) => {
  // short circuit
  if (!component) return null;

  // set to a constructable version for JSX
  const Component = component;

  // merge default Params and set ones
  const mergedParams = Object.keys(component.params).reduce((agg, x) => {
    agg[x] = params[x] != null ? params[x] : component.params[x].defaultValue;
    return agg;
  }, {});

  return cloneElement(<Component />, mergedParams);
};

export default ComponentRender;
