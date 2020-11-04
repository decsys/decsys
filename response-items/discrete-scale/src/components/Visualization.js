import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";

export const plotlyVis = (resultValues, radioValues) => {
  const aggregate = resultValues.reduce((agg, v) => {
    agg[v] = (agg[v] || 0) + 1;
    return agg;
  }, {});
  const data = radioValues.map((x) => ({ x, y: aggregate[x] || 0 }));

  return {
    data: [{ type: "bar", x: data.map((d) => d.x), y: data.map((d) => d.y) }],
    layout: {
      xaxis: { zeroline: false, title: "Discrete Value" },
      yaxis: { zeroline: false, title: "Participants" },
    },
  };
};

const Visualization = ({ resultValues, radioValues }) => {
  const aggregate = resultValues.reduce((agg, v) => {
    agg[v] = (agg[v] || 0) + 1;
    return agg;
  }, {});

  const counts = Object.keys(aggregate).map((v) => aggregate[v]);
  const data = radioValues.map((x) => ({ x, y: aggregate[x] || 0 }));

  return (
    <VictoryChart domainPadding={20}>
      <VictoryAxis
        label="Participants"
        dependentAxis
        tickCount={Math.max(...counts)}
        tickFormat={(x) => parseInt(x).toString()}
      />
      <VictoryAxis
        label="Discrete Value"
        tickValues={radioValues.map((x) => x.toString())}
      />
      <VictoryBar data={data} />
    </VictoryChart>
  );
};

export default Visualization;
