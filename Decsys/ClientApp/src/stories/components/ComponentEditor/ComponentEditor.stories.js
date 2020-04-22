import React from "react";
import ComponentEditor from "components/ComponentEditor";
import { paramsLookup, knob, components } from "../ComponentRender.stories";

export default {
  title: "Admin/ComponentEditor",
  component: ComponentEditor
};

export const Basic = () => (
  <ComponentEditor
    component={components[knob()]}
    params={paramsLookup[knob()].params}
  />
);
