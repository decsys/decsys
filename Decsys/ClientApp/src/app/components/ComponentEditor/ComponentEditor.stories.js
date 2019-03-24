import React from "react";
import { storiesOf } from "@storybook/react";
import ComponentEditor from "./ComponentEditor";
import {
  paramsLookup,
  knob,
  components
} from "../ComponentRender/ComponentRender.stories";

storiesOf("Admin/ComponentEditor", module).add("Default", () => (
  <ComponentEditor
    component={components[knob()]}
    params={paramsLookup[knob()].params}
  />
));
