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

const setGlobals = () => {
  window.__DECSYS__ = {}; // Register our global namespace

  // React, ReactDOM and styled need to stay as single instances, so we make them global for modules
  // Do the same with PropTypes to make components smaller - they'll all be using it and we have it
  // so why make them bundle it everytime?
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.PropTypes = PropTypes;
  // TODO: we should put param-types here - all DECSYS components will use it, save them all bundling it

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
