import React from "react";

const ComponentRender = ({ component: Component, params, actions }) => {
  if (!Component) return null;

  // merge default Params and set ones
  const defaults = Object.keys(Component.params).reduce((agg, x) => {
    agg[x] = Component.params[x].defaultValue;
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
