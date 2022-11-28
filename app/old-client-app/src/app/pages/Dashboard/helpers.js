import Plotly from "plotly.js";
import { saveSvgAsPng } from "save-svg-as-png";
import { visTypes } from "./constants";

// Helpers for saving visualisations as images

const SAVE_SVG = "svg";

/**
 * Determine if a defined visualisation supports saving as an image
 * @param {*} v The visualisation definition
 */
export const canSaveImage = (v) => {
  // all built-ins support saving
  // if saveImage exists we assume saving is supported
  return Object.values(visTypes).includes(v?.type) || !!v?.saveImage;
};

/**
 * Save a referenced DOM element's first SVG child as a PNG
 * @param {*} ref The DOM ref
 */
export const saveSvg = (ref) => {
  const svg = ref.current.querySelector("svg");
  saveSvgAsPng(svg, "visualization.png");
};

/**
 * Save a visualisation as an image
 * @param {*} index The index of the visualisation in the visualisations collection
 * @param {*} visualization the visualisation itself
 * @param {*} ref the DOM ref to the visualisation's containing div.
 */
export const saveImage = (index, visualization, ref) => {
  // TODO: document ability to allow saving
  // using "svg" or custom fn
  switch (visualization?.type) {
    case visTypes.plotly:
      Plotly.downloadImage(`plotly-vis${index}`);
      break;
    case visTypes.wordcloud:
      saveSvg(ref);
      break;
    default:
      if (typeof visualization?.saveImage === "function")
        visualization.saveImage();
      if (visualization.saveImage === SAVE_SVG) saveSvg(ref);
  }
};
