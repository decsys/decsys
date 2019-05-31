import React from "react";
import {
  VictoryLabel,
  VictoryChart,
  VictoryAxis,
  VictoryLine
} from "victory";

const tiny = 1e-10;

const Visualization = ({ barMaxValue, iaa }) => {
  const reducer = (data, x) => {
    const lastY = iaa.membership(x - tiny) * 100;
    const y = iaa.membership(x) * 100;
    const nextY = iaa.membership(x + tiny) * 100;

    if (lastY < y) data.push({ x, y: lastY });
    data.push({ x, y });
    if (nextY < y) data.push({ x, y: nextY });

    return data;
  };
  const data = iaa.intervals.singletonKeys.reduce(reducer, [{ x: 0, y: 0 }]);

  const maxY = Math.max(...data.map(d => d.y));

  const centroidValue = iaa.centroid;
  const centroid = [{ x: centroidValue, y: 0 }, { x: centroidValue, y: maxY }];

  return (
    <VictoryChart
      minDomain={{ x: 0, y: 0 }}
      maxDomain={{
        x: barMaxValue + barMaxValue * 0.1,
        y: maxY + maxY * 0.1
      }}
    >
      <VictoryAxis
        label="% Participants"
        dependentAxis
        axisLabelComponent={<VictoryLabel x={20} />}
      />
      {/* We draw the x axis twice
        * so we can fixed tick it at 0,
        * and then auto tick the rest
        */}
      <VictoryAxis label="Scale Value" />
      <VictoryAxis tickValues={[0]} />
      <VictoryLine data={data} />
      <VictoryLine
        data={centroid}
        style={{
          data: { stroke: "red" },
          labels: { angle: -90, fill: "red", fontSize: 16 }
        }}
        labels={["Centroid"]}
        labelComponent={<VictoryLabel y={150} />}
      />
    </VictoryChart>
  );
};

export default Visualization;
