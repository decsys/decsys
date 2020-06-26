import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography } from "@smooth-ui/core-sc";
import ParamTypes, { buildPropTypes } from "@decsys/param-types";
import ReactMarkdown from "react-markdown";
import { FlexBox } from "components/core";
import { Button, Box, Textarea } from "@chakra-ui/core";
import { FaInfoCircle } from "react-icons/fa";

const PageParagraph = ({ text, ...p }) => (
  <Typography as="div" {...p}>
    <ReactMarkdown source={text} />
  </Typography>
);

PageParagraph.params = {
  color: ParamTypes.string("Color", "black"),
  textAlign: ParamTypes.oneOf("Alignment", ["left", "center", "right"], "left"),
  fontFamily: ParamTypes.stringUndefined("Font Family")
};

const { pt, defaultProps } = buildPropTypes(PageParagraph.params, {
  // Text is configurable, but edited by our custom editor component
  // not the Platform's Params Editor
  text: PropTypes.string
});
PageParagraph.propTypes = pt;
PageParagraph.defaultProps = defaultProps;

const PageParagraphEditor = ({ params, onParamChange, renderedItem }) => {
  const [tab, setTab] = useState("edit");

  const [timer, setTimer] = useState();

  const [text, setText] = useState(params.text); // we use local state so updates work without delay
  useEffect(() => setText(params.text), [params]); // but still ensure update when new name props come in

  const handleChange = e => {
    setText(e.target.value); //update local state
    e.persist(); // tell React we want the event to have a longer lifetime than this scope
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onParamChange("text", e.target.value), 500));
  };
  return (
    <FlexBox flexDirection="column">
      <FlexBox alignItems="center">
        {/* TODO: Chakra Tabs */}
        <Button
          borderRadius={0}
          variant={tab === "edit" ? "primary" : "secondary"}
          onClick={() => setTab("edit")}
        >
          Edit Text
        </Button>
        <Button
          borderRadius={0}
          variant={tab === "preview" ? "primary" : "secondary"}
          onClick={() => setTab("preview")}
        >
          Preview
        </Button>
        {tab === "edit" && (
          <Typography ml={1}>
            <Box as={FaInfoCircle} /> Paragraphs support{" "}
            <a href="https://github.github.com/gfm/">
              Github Flavoured Markdown
            </a>
          </Typography>
        )}
      </FlexBox>
      {tab === "edit" && (
        <Textarea rows="8" value={text} onChange={handleChange} />
      )}
      {tab === "preview" && renderedItem}
    </FlexBox>
  );
};

PageParagraph.editorComponent = PageParagraphEditor;

export default PageParagraph;
