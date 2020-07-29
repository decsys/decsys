import React from "react";
import { Router } from "react-navi";
import { mount, route, redirect } from "navi";
import { action } from "@storybook/addon-actions";

// TODO: use in memory navigation instead of default browser

const generateRoutes = (paths) => {
  const blankRoute = paths.includes("/") ? "/__story-navi-blank-route__" : "/";
  const routes = {
    [blankRoute]: route({}),
  };
  paths.forEach((path) => {
    routes[path] = redirect(({ mountpath }) => {
      action("Navi route changed")(mountpath);
      return blankRoute;
    });
  });
  return routes;
};

const withNavi = (paths) => (story) => (
  <Router routes={mount(generateRoutes(paths))}>{story()}</Router>
);

export default withNavi;
