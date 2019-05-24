/**
 * For better or worse,
 * we currently make some bits globally available
 * to allow dynamic loading of unbundled react components at runtime.
 *
 * Someday this will probably become more heavily ES Modules based.
 *
 * Here's where the magic happens
 */

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import * as Victory from "victory";
import * as math from "mathjs";
import ReactWordCloud from "react-wordcloud";

const setGlobals = () => {
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
  styled.css = css;
  window.styled = styled;
};

export const loadComponentsModule = () => {
  // this depends on globals above being available, so we'll do that here
  setGlobals();

  // fetch DECSYS Component modules from the API and chuck them on the page
  // We get the App to do this so we can be sure our bundle is already loaded
  // including Component dependencies such as React, styled etc...
  //
  // Someday ES Modules will do this more nicely.
  const script = document.createElement("script");
  script.src = "/api/components";
  script.type = "module";
  document.body.appendChild(script);
};
