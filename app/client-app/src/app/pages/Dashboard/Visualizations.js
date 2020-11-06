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
} from "@chakra-ui/core";
import Plot from "react-plotly.js";
import ReactWordcloud from "react-wordcloud";
import { FaDownload } from "react-icons/fa";
import { visTypes, plotlyConfig } from "./constants";
import { canSaveImage, saveImage } from "./helpers";

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

const Visualizations = ({ visualizations = [] }) => {
  const [tabIndex, setTabIndex] = useState(0);

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
        <Tab>% Participants</Tab>
        {visualizations.map((v, i) => (
          <Tab key={i}>{v.name ?? `Visualisation ${i}`}</Tab>
        ))}
      </TabList>
      <TabPanels w="100%">
        <TabPanel>Hello</TabPanel>

        {visualizations.map((v, i) => {
          const containerRef = createRef();
          return (
            <TabPanel key={i}>
              {i === tabIndex - 1 && (
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
