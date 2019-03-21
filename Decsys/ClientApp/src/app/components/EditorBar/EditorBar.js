import React from "react";
import { Eye, Copy, FileExport, Trash } from "styled-icons/fa-solid";
import { Grid } from "styled-css-grid";
import EditorBarButton from "./Button";
import NameInput from "./NameInput";

const EditorBar = ({
  name,
  onPreviewClick,
  onDuplicateClick,
  onExportClick,
  onDeleteClick
}) => (
  <Grid columnGap="0px" columns="1fr auto auto auto auto">
    <NameInput />
    <EditorBarButton onClick={onPreviewClick}>
      <Eye size="1em" /> Preview
    </EditorBarButton>
    <EditorBarButton onClick={onDuplicateClick}>
      <Copy size="1em" /> Duplicate
    </EditorBarButton>
    <EditorBarButton onClick={onExportClick}>
      <FileExport size="1em" /> Export
    </EditorBarButton>
    <EditorBarButton variant="danger" onClick={onDeleteClick}>
      <Trash size="1em" /> Delete
    </EditorBarButton>
  </Grid>
);

export default EditorBar;
