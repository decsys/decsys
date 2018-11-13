import styled from "styled-components";
import { FrameHeight, BaseFontSize } from "../utils/defaults";

export default styled.div`
  height: ${props => props.frameHeight || FrameHeight};
  width: 100%;
  position: relative;
  font-size: ${BaseFontSize};
`;
