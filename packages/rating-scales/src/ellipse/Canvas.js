import styled from "styled-components";

// TODO make these member methods of the Canvas component

export const newDimensions = main => {
  const { width, height } = main.getBoundingClientRect();

  return { width, height };
};

export const setDimensions = (canvas, { width, height }) => {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};

/** An HTML Canvas element with styling applied, to be used for ellipse drawing */
const StyledCanvas = styled.canvas`
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
`;

/** @component */
export default StyledCanvas;
