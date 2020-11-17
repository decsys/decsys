/** Configure the global environment. */

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as math from "mathjs";
import * as Chakra from "@chakra-ui/react";

window.__DECSYS__ = {}; // Register our global namespace

// React needs to be a single instance, so we make it global for modules
// We do the same with some other supporting libraries too
window.React = React;
window.ReactDOM = ReactDOM;
window.PropTypes = PropTypes;
window.math = math;
window.Chakra = Chakra;

/**
 * Fetch DECSYS Component modules from the API and chuck them on the page
 * inside our global namespace.
 *
 * We get the App to do this so we can be sure our bundle is already loaded
 * including Component dependencies such as React, styled etc...
 *
 * Someday ES Modules will do this more nicely.
 * (dynamic import in ES2020?)
 */
export const loadPageResponseComponents = () => {
  const script = document.createElement("script");
  script.src = "/api/components";
  script.type = "module";
  document.body.appendChild(script);
};
