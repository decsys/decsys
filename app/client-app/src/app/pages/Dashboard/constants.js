export const visTypes = {
  plotly: "plotly",
  wordcloud: "wordcloud",
};

// we apply config to plotly visualizations, not the response item author.
export const plotlyConfig = {
  scrollZoom: false,
  displaylogo: false,
  modeBarButtonsToRemove: [
    //"zoom2d",
    //"pan2d",
    //"select2d",
    //"lasso2d",
    //"zoomIn2d",
    //"zoomOut2d",
    //"autoScale2d",
    //"resetScale2d",
    "zoom3d",
    "pan3d",
    "orbitRotation",
    "tableRotation",
    "handleDrag3d",
    "resetCameraDefault3d",
    "resetCameraLastSave3d",
    "hoverClosest3d",
    "hoverClosestCartesian",
    "hoverCompareCartesian",
    "zoomInGeo",
    "zoomOutGeo",
    "resetGeo",
    "hoverClosestGeo",
    "hoverClosestGl2d",
    "hoverClosestPie",
    "toggleHover",
    "resetViews",
    "toImage", // we use our own save button for consistency with other visualisations
    "sendDataToCloud",
    "toggleSpikelines",
    "resetViewMapbox",
  ],
};
