import { useState, useCallback } from "react";
import UnitValue from "unit-value/lib/unit-value";
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
import { behaviour as behaviourKeys, behaviours } from "./behaviours";

const DottedLine = ({ baseY, x1, x2 }) => {
  if (x1 == null || x2 == null) return null;

  return (
    <div
      css={{
        position: "absolute",
        top: `${baseY - 25}px`,
        left: x1,
        width: x2 - x1,
        borderTop: "dashed .2em gray",
      }}
    ></div>
  );
};

const getBehaviourProvider = (behaviour) =>
  behaviours[behaviour] ?? behaviours[behaviourKeys.SpeirsBridge2010];

const ScaleLabels = ({ labels: { min, mid, max } = {}, labelOptions }) => {
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
  return <FlexContainer>{labels}</FlexContainer>;
};

export const Scale = ({
  behaviour,
  labels = {},
  labelOptions = {},
  barOptions = {
    minValue: 0,
    maxValue: 100,
    // we depend on this one for calculations
    thickness: scaleBarDefaultProps.thickness,
  },
  scaleMarkerOptions = {},
  leftMarkerOptions = {},
  rightMarkerOptions = {},
  centerMarkerOptions = {},
  values = {},
  onChange = () => {},
}) => {
  const [markerState, setMarkerState] = useState({
    shared: {},
    left: {},
    right: {},
    center: {},
  });

  // mounting the bar / configuring dom ref
  // update marker state in response to prop changes (notably controlled values)
  const [bar, setBar] = useState(null);
  const barRef = useCallback(
    (bar) => {
      if (!bar) return;
      setBar(bar);

      // initialise the dragmarker now the bar is available
      const barBounds = getBounds(bar);

      // initialise state, including based on behaviour
      const initialMarkerState = {
        shared: {
          baseY: 0,
          baseX: barBounds.x,
        },
        left: {},
        right: {},
        center: {},
        ...getBehaviourProvider(behaviour).getInitialState(barBounds),
      };

      // add values if any are set
      const getMarkerX = (value, fallback) =>
        value != null
          ? getXPosForValue(
              value,
              barOptions.minValue,
              barOptions.maxValue,
              bar
            )
          : fallback;

      if (values?.left != null)
        initialMarkerState.left = {
          ...initialMarkerState.left,
          x: getMarkerX(values.left),
          isActivated: true,
        };
      if (values?.right != null)
        initialMarkerState.right = {
          ...initialMarkerState.right,
          x: getMarkerX(values.right),
          isActivated: true,
        };
      if (values?.center != null)
        initialMarkerState.center = {
          ...initialMarkerState.center,
          x: getMarkerX(values.center),
          isActivated: true,
        };

      // finally, set the initial state
      setMarkerState(
        getBehaviourProvider(behaviour).getUpdatedState(
          initialMarkerState,
          barBounds
        )
      );
    },
    [behaviour, values, barOptions.minValue, barOptions.maxValue]
  );

  const handleMarkerDrop = (markerId) => (x) => {
    const value = getValueForRelativeX(
      x,
      barOptions.minValue,
      barOptions.maxValue,
      bar
    );

    onChange(markerId, value, { ...values, [markerId]: value });
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
      <ScaleLabels labels={labels} labelOptions={labelOptions} />
      <FlexContainer>
        <DragMarker
          {...markerState.shared}
          {...markerState.left}
          {...leftMarkerOptions}
          onDrop={handleMarkerDrop("left")}
        />
        <DragMarker
          {...markerState.shared}
          {...markerState.right}
          {...rightMarkerOptions}
          onDrop={handleMarkerDrop("right")}
        />
        <DragMarker
          {...markerState.shared}
          {...markerState.center}
          {...centerMarkerOptions}
          onDrop={handleMarkerDrop("center")}
        />
        {behaviour === behaviourKeys.HeskethPryorHesketh1988 && (
          <>
            <DottedLine
              {...markerState.shared}
              x1={markerState.left.x}
              x2={markerState.center.x}
            />
            <DottedLine
              {...markerState.shared}
              x1={markerState.center.x}
              x2={markerState.right.x}
            />
          </>
        )}
      </FlexContainer>
    </ScaleBar>
  );
};
