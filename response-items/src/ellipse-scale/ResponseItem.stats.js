import * as math from "mathjs";
import IntervalAgreementApproach from "@decsys/iaa";

const fixedVal = 3;
const fixed = (fn, ...args) => parseFloat(fn(...args).toFixed(fixedVal));

const getPlotlyProps = (iaa,minMax) => {
  
  const reducer = (data, x) => {
    const y = iaa.membership(x) * 100;

    return {
      x: [...data.x, x],
      y: [...data.y, y],
    };
  };

  let data = iaa.intervals.singletonKeys
    .sort((x1, x2) => x1 - x2)
    .reduce(reducer, { x: [], y: [] });

  const newData = {...data}
  let prev=data.y[0]
  let added = 0
  for(let i=1;i<data.y.length;i++){
    const current = data.y[i]
    if(current<prev){
      newData.x.splice(i+added,0,data.x[i-1])
      newData.y.splice(i+added,0,data.y[i])
      added++
    }
    prev=current
  }
  data = {...newData}
  const maxY = Math.max(...data.y);
  const centroidValue = iaa.centroid;
  const dataTrace = {
    x: data.x,
    y: data.y,
    mode: "lines+markers",
    line: { shape: "hv" },
    type: "scatter",
    name: "Intervals",
  };

  const centroidTrace = {
    x: [centroidValue, centroidValue],
    y: [0, maxY],
    name: "Centroid",
  };

  return {
    data: [dataTrace, centroidTrace],
    layout: {
      xaxis: { zeroline: false, title: "Scale Value",range: minMax?[minMax.min-5, minMax.max+5]:null },
      yaxis: { zeroline: false, title: "% Participants",range: minMax?[minMax.min-5, minMax.max+5]:null },
    },
  };
};

export const stats = (_, results) => {
  // break down the results in a bunch of different useful ways...
  const reducer = (a, { minRangeValue: min, maxRangeValue: max }) => {
    a.values.push([min, max]);
    a.minValues.push(min);
    a.maxValues.push(max);
    a.intervalWidths.push(max - min);
    return a;
  };
  const { values, intervalWidths, minValues, maxValues } = results.reduce(
    reducer,
    {
      values: [],
      intervalWidths: [],
      minValues: [],
      maxValues: [],
    }
  );
  const iaa = new IntervalAgreementApproach();
  for (const interval of values) iaa.addInterval(interval);
  const centroidValue = iaa.centroid;

  return {
    visualizations: [
      {
        name: "Ellipse Results",
        type: "plotly",
        plotly: getPlotlyProps(iaa,{min:_.barMinValue,max:_.barMaxValue}),
      },
    ],
    stats: {
      "Left Endpoint - Mean, St.D": `${fixed(math.mean, minValues)}, ${fixed(
        math.std,
        minValues
      )}`,
      "Right Endpoint - Mean, St.D": `${fixed(math.mean, maxValues)}, ${fixed(
        math.std,
        maxValues
      )}`,
      "Size - Mean, St.D": `${fixed(math.mean, intervalWidths)}, ${fixed(
        math.std,
        intervalWidths
      )}`,
      "Response - Min, Max": `${fixed(Math.min, ...minValues)}, ${fixed(
        Math.max,
        ...maxValues
      )}`,
      Centroid: fixed((args) => args, centroidValue),
    },
  };
};
