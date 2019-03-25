import styled from "styled-components";

// TODO make these member methods of the Canvas component

export const newDimensions = (main, ...elems) => {
  const { innerHeight } = window;
  const { width, height } = main.getBoundingClientRect();
  const heights = Array.from(elems).map(x =>
    x instanceof Element ? x.getBoundingClientRect().height : 0
  );

  return { width, height }; //height: Math.max(height, innerHeight, ...heights) };
};

export const setDimensions = (canvas, { width, height }) => {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};

export const setPosition = canvas => {
  const { left, top } = canvas.getBoundingClientRect();
  canvas.style.left = `${-left}px`;
  canvas.style.top = `${-top}px`;
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
