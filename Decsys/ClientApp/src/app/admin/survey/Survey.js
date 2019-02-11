import React from "react";
import { Switch, Route } from "react-router-dom";
import Editor from "./editor/Editor";
import Preview from "./preview/Preview";
import Export from "./export/Export";

const Survey = props => (
  <Switch>
    <Route exact path={`${props.match.url}`} component={Editor} />

    <Route path={`${props.match.url}/preview`} component={Preview} />

    <Route path={`${props.match.url}/export`} component={Export} />
  </Switch>
);

export default Survey;
