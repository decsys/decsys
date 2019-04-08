import React, { cloneElement } from "react";

const ComponentRender = ({
  component,
  params,
  actions = {
    setNextEnabled: () => {},
    logResults: () => {},
    logEvent: () => {}
  }
}) => {
  // short circuit
  if (!component) return null;

  // set to a constructable version for JSX
  const Component = component;

  // merge default Params and set ones
  const defaults = Object.keys(component.params).reduce((agg, x) => {
    agg[x] = component.params[x].defaultValue;
    return agg;
  }, {});

  return cloneElement(<Component />, { ...defaults, ...params, ...actions });
};

export default ComponentRender;
