import React from "react";

const ComponentRender = ({ component, params, actions }) => {
  // short circuit
  if (!component) return null;

  // set to a constructable version for JSX
  const Component = component;

  // merge default Params and set ones
  const defaults = Object.keys(component.params).reduce((agg, x) => {
    agg[x] = component.params[x].defaultValue;
    return agg;
  }, {});

  return <Component {...{ ...defaults, ...params, ...actions }} />;
};
ComponentRender.defaultProps = {
  actions: {
    setNextEnabled: () => {},
    logResults: () => {},
    logEvent: () => {}
  }
};

export default ComponentRender;
