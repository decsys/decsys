/** Configure the global environment. */

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as Victory from "victory";
import * as math from "mathjs";
import ReactWordCloud from "react-wordcloud";
import * as Chakra from "@chakra-ui/core";
import * as EmotionCore from "@emotion/core";

window.__DECSYS__ = {}; // Register our global namespace

// React needs to be a single instance, so we make it global for modules
// We do the same with some other supporting libraries too
window.React = React;
window.ReactDOM = ReactDOM;
window.PropTypes = PropTypes;
window.Victory = Victory;
window.math = math;
window.reactWordCloud = ReactWordCloud;
window.EmotionCore = EmotionCore;
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
