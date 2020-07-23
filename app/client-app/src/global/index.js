/** Configure the global environment. */

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as Victory from "victory";
import * as math from "mathjs";
import ReactWordCloud from "react-wordcloud";
import styled, * as styledNamed from "styled-components";

window.__DECSYS__ = {}; // Register our global namespace

// React, ReactDOM and styled need to stay as single instances, so we make them global for modules
// We do the same with some other supporting libraries too
window.React = React;
window.ReactDOM = ReactDOM;
window.PropTypes = PropTypes;
window.Victory = Victory;
window.math = math;
window.reactWordCloud = ReactWordCloud;

// Styled doesn't put all its named exports on the default :(
// So I guess that job is on us until we have a better way to do this than globals
window.styled = { ...styled, ...styledNamed };

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
