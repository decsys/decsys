import { useState, useCallback } from "react";
import UnitValue from "unit-value/lib/unit-value";
import Frame from "../core/Frame";
import Question from "../core/Question";
import {
  FlexContainer,
  ScaleBar,
  scaleBarDefaultProps,
} from "../core/ScaleBar";
import { ScaleMarkerSet } from "../core/ScaleMarkerSet";
import { getBounds } from "../core/services/bar-coords";
import { DragMarker } from "./DragMarker";

const VisualAnalogScale = ({
  frameHeight,
  questionOptions,
  question,
  barOptions,
  scaleMarkerOptions,
}) => {
  const [markerBounds, setMarkerBounds] = useState({});

  // TODO: ref vs state for callback refs? (Ellipse uses State, DragMarker uses ref!)
  const [bar, setBar] = useState(null);
  const barRef = useCallback((bar) => {
    if (!bar) return;
    setBar(bar);

    // initialise the dragmarker now the bar is available
    const { width, x } = getBounds(bar);
    setMarkerBounds({
      xInit: width / 2,
      yAnchor: 0,
      xMin: x,
      xMax: width + x,
      xOffset: x,
    });
  }, []);

  return (
    <Frame frameHeight={frameHeight}>
      <Question {...questionOptions}>{question}</Question>
      <ScaleBar ref={barRef} {...barOptions}>
        <FlexContainer>
          <ScaleMarkerSet
            {...{
              // we compute some scale marker defaults
              // if not explicitly provided
              thickness: barOptions.thickness,
              length: UnitValue.multiply(barOptions.thickness, 8).toString(),
              ...scaleMarkerOptions,
            }}
          />
        </FlexContainer>
        <FlexContainer>
          <DragMarker {...markerBounds} />
        </FlexContainer>
      </ScaleBar>
    </Frame>
  );
};

VisualAnalogScale.defaultProps = {
  questionOptions: {},
  barOptions: {
    minValue: 0,
    maxValue: 100,
    // we depend on this one for calculations
    thickness: scaleBarDefaultProps.thickness,
  },
  labelOptions: {},
  labels: {},
  scaleMarkerOptions: {},
};

export { VisualAnalogScale };
