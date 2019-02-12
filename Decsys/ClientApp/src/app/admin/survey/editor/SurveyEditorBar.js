import React from "react";
import { Input, Button } from "@smooth-ui/core-sc";
import { Eye, Copy, FileExport, Trash } from "styled-icons/fa-solid";
import { Grid } from "styled-css-grid";

const EditorBarButton = props => (
  <Button borderRadius={0} width="120px" variant="secondary" {...props} />
);

const SurveyEditorBar = ({ name }) => (
  <Grid columnGap="0px" columns="1fr auto auto auto auto">
    <Input size="lg" defaultValue={name} />
    <EditorBarButton>
      <Eye size="1em" /> Preview
    </EditorBarButton>
    <EditorBarButton>
      <Copy size="1em" /> Duplicate
    </EditorBarButton>
    <EditorBarButton>
      <FileExport size="1em" /> Export
    </EditorBarButton>
    <EditorBarButton variant="danger">
      <Trash size="1em" /> Delete
    </EditorBarButton>
  </Grid>
);

export default SurveyEditorBar;
