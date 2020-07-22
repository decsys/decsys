import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import ReactMarkdown from "react-markdown";
import {
  Icon,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Link,
  Stack,
  Text,
} from "@chakra-ui/core";
import { FaInfoCircle, FaExternalLinkAlt } from "react-icons/fa";

const PageParagraph = ({ text, color, ...p }) => (
  // we set color in standard CSS,
  // so that simple CSS color names work e.g. "red"
  // and we don't have to explain to users how chakra theme colors work e.g. "red.500"
  <Text as="div" {...p} style={{ color }}>
    <ReactMarkdown source={text} />
  </Text>
);

PageParagraph.params = {
  color: ParamTypes.string("Color", "black"),
  textAlign: ParamTypes.oneOf("Alignment", ["left", "center", "right"], "left"),
  fontFamily: ParamTypes.stringUndefined("Font Family"),
};

const { pt, defaultProps } = buildPropTypes(PageParagraph.params, {
  // Text is configurable, but edited by our custom editor component
  // not the Platform's Params Editor
  text: PropTypes.string,
});
PageParagraph.propTypes = pt;
PageParagraph.defaultProps = defaultProps;

const PageParagraphEditor = ({ params, onParamChange, renderedItem }) => {
  const [gfmVisible, setGfmVisible] = useState(true);

  const [timer, setTimer] = useState();

  const [text, setText] = useState(params.text); // we use local state so updates work without delay
  useEffect(() => setText(params.text), [params]); // but still ensure update when new name props come in

  const handleChange = (e) => {
    setText(e.target.value); //update local state
    e.persist(); // tell React we want the event to have a longer lifetime than this scope
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onParamChange("text", e.target.value), 500));
  };
  return (
    <Tabs onChange={(i) => setGfmVisible(!i)}>
      <TabList>
        <Tab>Edit</Tab>
        <Tab>Preview</Tab>
        <Stack direction="row" align="center" hidden={!gfmVisible}>
          <Icon as={FaInfoCircle} />
          <Text>Paragraphs support</Text>
          <Link
            isExternal
            href="https://github.github.com/gfm/"
            color="blue.500"
          >
            Github Flavoured Markdown
            <sup>
              <Icon ml={1} as={FaExternalLinkAlt} />
            </sup>
          </Link>
        </Stack>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Textarea rows="8" value={text} onChange={handleChange} />
        </TabPanel>
        <TabPanel>{renderedItem}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

PageParagraph.editorComponent = PageParagraphEditor;

export default PageParagraph;
