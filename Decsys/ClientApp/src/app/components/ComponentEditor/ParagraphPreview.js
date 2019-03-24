import React, { useState } from "react";
import { Button, Textarea, Typography } from "@smooth-ui/core-sc";
import { FlexBox } from "../ui";
import ComponentRender from "../ComponentRender";
import { InfoCircle } from "styled-icons/fa-solid";

const ParagraphPreview = ({ component, params }) => {
  const [text, setText] = useState("");
  const [tab, setTab] = useState("edit");
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
      {tab === "edit" && <Textarea value={params.text} />}
      {tab === "preview" && (
        <ComponentRender component={component} params={params} />
      )}
    </FlexBox>
  );
};

export default ParagraphPreview;
