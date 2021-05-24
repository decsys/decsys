import { useState, useCallback } from "react";
import UnitValue from "unit-value/lib/unit-value";
import Frame from "../core/Frame";
import Question from "../core/Question";
import {
  FlexContainer,
  ScaleBar,
  scaleBarDefaultProps,
} from "../core/ScaleBar";
import ScaleLabel from "../core/ScaleLabel";
import { ScaleMarkerSet } from "../core/ScaleMarkerSet";
import { getBounds, getValueForRelativeX } from "../core/services/bar-coords";
import { DragMarker } from "./DragMarker";

const VisualAnalogScale = ({
  frameHeight,
  questionOptions,
  question,
  barOptions,
  labels: { min, mid, max },
  labelOptions,
  scaleMarkerOptions,
  dragMarkerOptions,
}) => {
  const [markerBounds, setMarkerBounds] = useState({});

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

  const labels = [];
  const labelValues = [min, mid, max];
  for (let i = 0; i < labelValues.length; i++) {
    labels.push(
      <ScaleLabel
        key={i}
        labelIndex={i}
        {...{ ...labelOptions, yAlign: "below" }} // fix labels to below as the marker is above
        value={labelValues[i]}
      />
    );
  }

  const handleMarkerDrop = (barRelativeX) => {
    const value = getValueForRelativeX(
      barRelativeX,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );
    document.dispatchEvent(new CustomEvent("VasCompleted", { detail: value }));
  };

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
        <FlexContainer>{labels}</FlexContainer>
        <FlexContainer>
          <DragMarker
            {...markerBounds}
            {...dragMarkerOptions}
            onDrop={handleMarkerDrop}
          />
        </FlexContainer>
      </ScaleBar>
    </Frame>
  );
};

// TODO: PropTypes

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
  dragMarkerOptions: {},
};

export { VisualAnalogScale };
