import React, { useState, useMemo, createRef } from "react";
import {
  Flex,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  IconButton,
} from "@chakra-ui/react";
import Plot from "react-plotly.js";
import ReactWordcloud from "react-wordcloud";
import { FaDownload } from "react-icons/fa";
import { visTypes, plotlyConfig } from "./constants";
import { canSaveImage, saveImage } from "./helpers";

const responseRatio = (completion) => {
  const participantIds = Object.keys(completion);
  const respondedCount = participantIds.filter((k) => !!completion[k]).length;
  const remainingCount = participantIds.length - respondedCount;
  console.log(completion, respondedCount, remainingCount);
  return {
    name: "Response Ratio",
    type: visTypes.plotly,
    plotly: {
      data: [
        {
          type: "pie",
          values: [respondedCount, remainingCount],
          labels: ["Responded", "No Response"],
        },
      ],
      layout: {
        title: "Participant Response Ratio",
      },
    },
  };
};

const Visualization = ({ index, visualization }) =>
  useMemo(() => {
    switch (visualization?.type) {
      // TODO: Document the available built-in types
      case visTypes.plotly:
        const { config, ...plotly } = visualization.plotly; // throw away the config, if any
        return (
          <Plot
            {...plotly}
            config={plotlyConfig}
            divId={`plotly-vis${index}`}
          />
        );
      case visTypes.wordcloud:
        return <ReactWordcloud {...visualization.wordcloud} />;
      default:
        // render a component if there is one, or nothing
        return visualization?.component ?? null;
    }
  }, [visualization, index]);

const Visualizations = ({ visualizations = [], completion }) => {
  const [tabIndex, setTabIndex] = useState(0);

  // we inject some platform level visualisations before the response item's ones
  const combinedVis = [responseRatio(completion), ...visualizations];

  return (
    <Tabs
      w="100%"
      orientation="vertical"
      display="grid"
      gridTemplateColumns="auto 1fr"
      variant="soft-rounded"
      size="sm"
      index={tabIndex}
      onChange={setTabIndex}
    >
      <TabList>
        <Text mb={2}>Visualizations:</Text>
        {combinedVis.map((v, i) => (
          <Tab key={i}>{v.name ?? `Visualisation ${i}`}</Tab>
        ))}
      </TabList>
      <TabPanels w="100%">
        {combinedVis.map((v, i) => {
          const containerRef = createRef();
          return (
            <TabPanel key={i}>
              {i === tabIndex && (
                // We deliberately re-mount if this is the selected tab
                // as some Viz components are unhappy with the way
                // Chakra tabs show and hide panel content (e.g. react-wordcloud)
                <Stack>
                  {canSaveImage(v) && (
                    <Flex justify="flex-end">
                      <IconButton
                        onClick={() => saveImage(i, v, containerRef)}
                        title="Save this visualisation..."
                        icon={<FaDownload />}
                      />
                    </Flex>
                  )}
                  <div ref={containerRef}>
                    <Visualization visualization={v} index={i} />
                  </div>
                </Stack>
              )}
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export default Visualizations;
