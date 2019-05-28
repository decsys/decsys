import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";

const Visualization = ({ values }) => {
  const aggregate = values.reduce((agg, v) => {
    agg[v] = (agg[v] || 0) + 1;
    return agg;
  }, {});

  const counts = Object.keys(aggregate).map(v => aggregate[v]);
  const data = Object.keys(aggregate).map(x => ({ x, y: aggregate[x] }));

  return (
    <VictoryChart domainPadding={20}>
      <VictoryAxis
        label="Participants"
        dependentAxis
        tickCount={Math.max(...counts)}
        tickFormat={x => parseInt(x).toString()}
      />
      <VictoryAxis label="Discrete Value" />
      <VictoryBar data={data} />
    </VictoryChart>
  );
};

export default Visualization;
