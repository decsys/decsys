import React, { useState, useEffect } from "react";
import { Button, Textarea, Typography } from "@smooth-ui/core-sc";
import { FlexBox } from "../ui";
import ComponentRender from "../ComponentRender";
import { InfoCircle } from "styled-icons/fa-solid";

const ParagraphPreview = ({ component, params, onChange }) => {
  const [tab, setTab] = useState("edit");

  const [timer, setTimer] = useState();

  const [text, setText] = useState(params.text); // we use local state so updates work without delay
  useEffect(() => setText(params.text), [params]); // but still ensure update when new name props come in

  const handleChange = e => {
    setText(e.target.value); //update local state
    e.persist(); // tell React we want the event to have a longer lifetime than this scope
    //delay, then fire the onChange passed in
    clearTimeout(timer); // reset the delay timer every change
    setTimer(setTimeout(() => onChange(e), 500));
  };
  return (
    <FlexBox flexDirection="column">
      <FlexBox alignItems="center">
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
            <InfoCircle size="1em" /> Paragraphs support{" "}
            <a href="https://github.github.com/gfm/">
              Github Flavoured Markdown
            </a>
          </Typography>
        )}
      </FlexBox>
      {tab === "edit" && (
        <Textarea rows="8" value={text} onChange={handleChange} />
      )}
      {tab === "preview" && (
        <ComponentRender component={component} params={params} />
      )}
    </FlexBox>
  );
};

export default ParagraphPreview;
