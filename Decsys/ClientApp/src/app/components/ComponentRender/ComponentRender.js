import React, { cloneElement } from "react";

const ComponentRender = ({ component, params }) => {
  return <>{component && cloneElement(component, params)}</>;
};

export default ComponentRender;
