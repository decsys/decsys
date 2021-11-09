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
import {
  getBounds,
  getValueForRelativeX,
  getXPosForValue,
} from "../core/services/bar-coords";
import { DragMarker } from "./DragMarker";

export const Scale = ({
  barOptions = {
    minValue: 0,
    maxValue: 100,
    // we depend on this one for calculations
    thickness: scaleBarDefaultProps.thickness,
  },
  labels: { min, mid, max } = {},
  labelOptions = {},
  scaleMarkerOptions = {},
  dragMarkerOptions = {},
  value,
  onChange = () => {},
  isDisabled,
}) => {
  const [markerState, setMarkerState] = useState({});

  const [bar, setBar] = useState(null);
  const barRef = useCallback(
    (bar) => {
      if (!bar) return;
      setBar(bar);

      // initialise the dragmarker now the bar is available
      const markerX =
        value &&
        getXPosForValue(value, barOptions.minValue, barOptions.maxValue, bar);
      const { width, x: barX } = getBounds(bar);
      setMarkerState((old) => ({
        x: markerX ?? width / 2,
        baseX: barX,
        baseY: 0,
        xMin: barX,
        xMax: width + barX,
        isActivated: markerX ?? false,
        isDisabled: isDisabled,
      }));
    },
    [value, barOptions.minValue, barOptions.maxValue, isDisabled]
  );

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

  const handleMarkerDrop = (x) => {
    const value = getValueForRelativeX(
      x,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );
    onChange(value);
  };

  return (
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
          {...markerState}
          {...dragMarkerOptions}
          onDrop={handleMarkerDrop}
        />
      </FlexContainer>
    </ScaleBar>
  );
};

const VisualAnalogScale = ({
  frameHeight = "300px",
  questionOptions = {},
  question,
  barOptions,
  labels,
  labelOptions,
  scaleMarkerOptions,
  dragMarkerOptions,
  value,
  onChange,
}) => {
  return (
    <Frame frameHeight={frameHeight}>
      <Question {...questionOptions}>{question}</Question>
      <Scale
        barOptions={barOptions}
        labels={labels}
        labelOptions={labelOptions}
        scaleMarkerOptions={scaleMarkerOptions}
        dragMarkerOptions={dragMarkerOptions}
        onChange={onChange}
        value={value}
      />
    </Frame>
  );
};

export { VisualAnalogScale };
